"use strict";
var mongoose = require("mongoose"),
  model = require("../models/model"),
  mq = require("../../core/controllers/rabbitmq"),
  Lineconnect = mongoose.model("Lineconnect"),
  Tvdscustomer = mongoose.model("Tvdscustomer"),
  Joborder = mongoose.model("Joborder"),
  errorHandler = require("../../core/controllers/errors.server.controller"),
  lineChat = require("../../core/controllers/lineChat"),
  socket = require("../../../config/socket.io.js"),
  _ = require("lodash");

exports.getList = function (req, res) {
  var pageNo = parseInt(req.query.pageNo);
  var size = parseInt(req.query.size);
  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1",
    };
    return res.json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  Lineconnect.find({}, {}, query, function (err, datas) {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err),
      });
    } else {
      res.jsonp({
        status: 200,
        data: datas,
      });
    }
  });
};

exports.create = function (req, res) {
  var newLineconnect = new Lineconnect(req.body);
  newLineconnect.createby = req.user;
  newLineconnect.save(function (err, data) {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err),
      });
    } else {
      res.jsonp({
        status: 200,
        data: data,
      });
      /**
       * Message Queue
       */
      // mq.publish('exchange', 'keymsg', JSON.stringify(newOrder));
    }
  });
};

exports.getByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      status: 400,
      message: "Id is invalid",
    });
  }

  Lineconnect.findById(id, function (err, data) {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err),
      });
    } else {
      req.data = data ? data : {};
      next();
    }
  });
};

exports.read = function (req, res) {
  res.jsonp({
    status: 200,
    data: req.data ? req.data : [],
  });
};

exports.update = function (req, res) {
  var updLineconnect = _.extend(req.data, req.body);
  updLineconnect.updated = new Date();
  updLineconnect.updateby = req.user;
  updLineconnect.save(function (err, data) {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err),
      });
    } else {
      res.jsonp({
        status: 200,
        data: data,
      });
    }
  });
};

exports.delete = function (req, res) {
  req.data.remove(function (err, data) {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err),
      });
    } else {
      res.jsonp({
        status: 200,
        data: data,
      });
    }
  });
};

exports.hook = function (req, res, next) {
  if (req.body.events[0].message) {
    next();
  } else {
    console.log(req.body.events[0]);
    res.jsonp({
      status: 200,
      data: req.body.events[0],
    });
  }
};

exports.registerIntent = async function (req, res, next) {
  if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ยืนยันการลงทะเบียน"
  ) {
    let messages = [
      {
        type: "template",
        altText: "this is a buttons template",
        template: {
          type: "buttons",
          actions: [
            {
              type: "uri",
              label: "คลิ๊กเพื่อระบุพิกัด",
              uri: "line://nv/location",
            },
          ],
          title: "ขอบคุณสำหรับการลงทะเบียน",
          text: "กรุณาระบุพิกัดสำหรับขอรับบริการรถธรรมธุรกิจ",
        },
      },
    ];
    let reply = await lineChat.replyMessage(
      req.body.events[0].replyToken,
      messages
    );
    res.jsonp({
      status: 200,
      data: req.body.events[0],
    });
  } else {
    next();
  }
};

exports.registerLocationIntent = async function (req, res, next) {
  if (req.body.events[0].message.type === "location") {
    let query = {
      lineUserId: req.body.events[0].source.userId,
    };
    let update = {
      latitude: `${req.body.events[0].message.latitude}`,
      longitude: `${req.body.events[0].message.longitude}`,
    };
    Tvdscustomer.findOneAndUpdate(query, update, async function (err, data) {
      if (err) {
        let message = [];
        messages.push({
          type: `text`,
          text: `คุณยังไม่เคยลงทะเบียนกับรถธรรมธุรกิจ`,
        });
        messages.push({
          type: `text`,
          text: `กรุณาเลือก เมนู > ข้อมูลสมาชิก`,
        });
        let reply = await lineChat.replyMessage(
          req.body.events[0].replyToken,
          messages
        );
        return res.status(400).send({
          status: 400,
          message: errorHandler.getErrorMessage(err),
        });
      }
      let messages = [
        {
          type: `text`,
          text: `ขอบคุณสำหรับข้อมูลพิกัด`,
        },
      ];
      let reply = await lineChat.replyMessage(
        req.body.events[0].replyToken,
        messages
      );
      res.jsonp({
        status: 200,
        data: req.body.events[0],
      });
    });
  } else {
    next();
  }
};

exports.confirmAndRejectIntent = async function (req, res, next) {
  if (
    req.body.events[0].message.type === "text" &&
    (req.body.events[0].message.text.startsWith("รับนัดหมาย") ||
      req.body.events[0].message.text.startsWith("ปฏิเสธ"))
  ) {
    let arrMsg = req.body.events[0].message.text.split(":");
    if (arrMsg.length === 3) {
      let messages = [
        {
          type: `text`,
          text: `ระบบกำลังดำเนินการ "ยืนยัน" นัดหมายของท่าน...`,
        },
      ];

      Joborder.findOne({ docno: arrMsg[2].trim() }, async (err, order) => {
        if (err) {
          messages.push({
            type: `text`,
            text: `เกิดข้อผิดพลาดในการยืนยันนัดหมาย! กรุณาติดต่อกลับหาเรา`,
          });
        } else {
          order.contactLists.forEach((contact) => {
            if (contact.lineUserId === req.body.events[0].source.userId) {
              contact.contactStatus = req.body.events[0].message.text.startsWith(
                "รับนัดหมาย"
              )
                ? "confirm"
                : "reject";
            }
          });
          order.save(async function (err, data) {
            if (err) {
              req.replyBody.messages.push({
                type: `text`,
                text: `เกิดข้อผิดพลาดในการยืนยันนัดหมาย! กรุณาติดต่อกลับหาเรา`,
              });
            } else {
              socket.io.emit("user-confirm-reject", data);
              if (req.body.events[0].message.text.startsWith("รับนัดหมาย")) {
                messages.push({
                  type: `text`,
                  text: `ระบบยืนยันนัดหมายของท่านเรียบร้อยครับ`,
                });
              } else {
                messages.push({
                  type: `text`,
                  text: `ขอบคุณครับ ไว้โอกาสหน้าจะนัดหมายมาใหม่นะครับ`,
                });
              }
            }
            let reply = await lineChat.replyMessage(
              req.body.events[0].replyToken,
              messages
            );
            res.jsonp({
              status: 200,
              data: req.body.events[0],
            });
          });
        }
      });
    }
  } else {
    next();
  }
};

exports.getAppooimentsIntent = async function (req, res, next) {
  if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ข้อมูลการนัดหมาย"
  ) {
    let messages = [
      {
        type: "template",
        altText: "this is a carousel template",
        template: {
          type: "carousel",
          columns: [
            {
              type: "bubble",
              styles: {
                footer: {
                  backgroundColor: "#42b3f4",
                },
              },
              header: {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "box",
                    layout: "baseline",
                    contents: [
                      {
                        type: "icon",
                        size: "xxl",
                        url:
                          "https://scontent.fbkk7-2.fna.fbcdn.net/v/t1.0-1/p200x200/22814542_1962234637127047_1607260544847069468_n.png?_nc_cat=0&oh=2a303227c24dfab9e71a405b6d594d50&oe=5BC3965D",
                      },
                    ],
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    flex: 5,
                    contents: [
                      {
                        type: "text",
                        text: "โรงพยาบาลอ่างทอง",
                        weight: "bold",
                        color: "#aaaaaa",
                        size: "md",
                        gravity: "top",
                      },
                      {
                        type: "text",
                        text: "ขอขอบพระคุณ",
                        weight: "bold",
                        color: "#aaaaaa",
                        size: "lg",
                        gravity: "top",
                      },
                    ],
                  },
                ],
              },
              hero: {
                type: "image",
                url:
                  "https://scontent.fbkk7-2.fna.fbcdn.net/v/t1.0-9/35076722_2227987830551725_330757188106584064_n.jpg?_nc_cat=0&oh=0f5fa137c5bd65f109a40439afcd59eb&oe=5BB566B6",
                size: "full",
                aspectRatio: "16:9",
                aspectMode: "cover",
                action: {
                  type: "uri",
                  uri: "http://bit.ly/2JGBRKv",
                },
              },
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    margin: "sm",
                    text: "คุณกานต์สินี ไหลสงวนงาม",
                    weight: "bold",
                    size: "md",
                    wrap: true,
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    margin: "xs",
                    contents: [
                      {
                        type: "box",
                        layout: "baseline",
                        spacing: "sm",
                        contents: [
                          {
                            type: "text",
                            text:
                              "บริจาคเงินจำนวน ๑๘๐,๐๐๐ บาท เพื่อซื้อครุภัณฑ์ทางการแพทย์ ใช้ในโรงพยาบาลอ่างทอง โดยมีนายแพทย์พงษ์นรินทร์ ชาติรังสรรค์ผู้อำนวยการโรงพยาบาลอ่างทอง เป็นผู้รับมอบ",
                            wrap: true,
                            color: "#666666",
                            size: "sm",
                            flex: 6,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: "text",
                    margin: "md",
                    text: "วันที่ 12 มิ.ย. 2561",
                    size: "sm",
                    color: "#adadad",
                  },
                ],
              },
              footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                  {
                    type: "button",
                    style: "link",
                    color: "#FFFFFF",
                    height: "sm",
                    action: {
                      type: "uri",
                      label: "อ่านต่อ...",
                      uri: "http://bit.ly/2JGBRKv",
                    },
                  },
                ],
              },
            },
            {
              type: "bubble",
              styles: {
                footer: {
                  backgroundColor: "#42b3f4",
                },
              },
              header: {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "box",
                    layout: "baseline",
                    contents: [
                      {
                        type: "icon",
                        size: "xxl",
                        url:
                          "https://scontent.fbkk7-2.fna.fbcdn.net/v/t1.0-1/p200x200/22814542_1962234637127047_1607260544847069468_n.png?_nc_cat=0&oh=2a303227c24dfab9e71a405b6d594d50&oe=5BC3965D",
                      },
                    ],
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    flex: 5,
                    contents: [
                      {
                        type: "text",
                        text: "โรงพยาบาลอ่างทอง",
                        weight: "bold",
                        color: "#aaaaaa",
                        size: "md",
                        gravity: "top",
                      },
                      {
                        type: "text",
                        text: "ขอขอบพระคุณ",
                        weight: "bold",
                        color: "#aaaaaa",
                        size: "lg",
                        gravity: "top",
                      },
                    ],
                  },
                ],
              },
              hero: {
                type: "image",
                url:
                  "https://scontent.fbkk7-2.fna.fbcdn.net/v/t1.0-9/35076722_2227987830551725_330757188106584064_n.jpg?_nc_cat=0&oh=0f5fa137c5bd65f109a40439afcd59eb&oe=5BB566B6",
                size: "full",
                aspectRatio: "16:9",
                aspectMode: "cover",
                action: {
                  type: "uri",
                  uri: "http://bit.ly/2JGBRKv",
                },
              },
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    margin: "sm",
                    text: "คุณกานต์สินี ไหลสงวนงาม",
                    weight: "bold",
                    size: "md",
                    wrap: true,
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    margin: "xs",
                    contents: [
                      {
                        type: "box",
                        layout: "baseline",
                        spacing: "sm",
                        contents: [
                          {
                            type: "text",
                            text:
                              "บริจาคเงินจำนวน ๑๘๐,๐๐๐ บาท เพื่อซื้อครุภัณฑ์ทางการแพทย์ ใช้ในโรงพยาบาลอ่างทอง โดยมีนายแพทย์พงษ์นรินทร์ ชาติรังสรรค์ผู้อำนวยการโรงพยาบาลอ่างทอง เป็นผู้รับมอบ",
                            wrap: true,
                            color: "#666666",
                            size: "sm",
                            flex: 6,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: "text",
                    margin: "md",
                    text: "วันที่ 12 มิ.ย. 2561",
                    size: "sm",
                    color: "#adadad",
                  },
                ],
              },
              footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                  {
                    type: "button",
                    style: "link",
                    color: "#FFFFFF",
                    height: "sm",
                    action: {
                      type: "uri",
                      label: "อ่านต่อ...",
                      uri: "http://bit.ly/2JGBRKv",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ];
    let reply = await lineChat.replyMessage(
      req.body.events[0].replyToken,
      messages
    );
    res.jsonp({
      status: 200,
      data: req.body.events[0],
    });
  } else {
    next();
  }
};

exports.getJobOrderIntent = async function (req, res, next) {
  if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ดูใบงาน"
  ) {
    let messages = [];
    let reply = await lineChat.replyMessage(
      req.body.events[0].replyToken,
      messages
    );
    res.jsonp({
      status: 200,
      data: req.body.events[0],
    });
  } else {
    next();
  }
};

exports.fallbackIntent = function (req, res, next) {
  next();
};

exports.completedChat = async function (req, res) {
  res.jsonp({
    status: 200,
    data: req.body.events[0],
  });
};

exports.pushMessage = async function (req, res) {
  let body = JSON.stringify(req.body);
  let push = await lineChat.pushMessage(req.body);
  res.jsonp({
    status: 200,
    data: req.body,
  });
};
