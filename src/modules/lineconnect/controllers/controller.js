"use strict";

const CHANNEL_ACCESS_TOKEN =
  process.env.CHANNEL_ACCESS_TOKEN ||
  "4A287j6ijUzndwahgTuuucdZTEJOUN/hxlsEX/kjr6WlpPxxxYogNRcx+sZfhfTETeLeLy2jP67GcrOz1AsoJaPkL8t/Pfn+8ZeAYHliSBV3FJNcoVPbodNseuO3sQdAmdxaFFK5TohdUAa3b7UmKQdB04t89/1O/w1cDnyilFU=";

const SATFF_CHANNEL_ACCESS_TOKEN =
  process.env.SATFF_CHANNEL_ACCESS_TOKEN ||
  "WblrHOmUiMEGo8R+sKJEfp3tYJF6lZCiljPGAPYRf8kXgFdFZKh9Qrz4bQN9mJ1gYglgjg7R05CL5zACB9rlxGptxzJMC6pvxpvFCxXVVVyftk5SEqLX4vhin0MWj8jPTFxbezCyvT9D4IEO8KX2qAdB04t89/1O/w1cDnyilFU=";

var mongoose = require("mongoose"),
  model = require("../models/model"),
  mq = require("../../core/controllers/rabbitmq"),
  moment = require("moment"),
  Lineconnect = mongoose.model("Lineconnect"),
  Tvdscustomer = mongoose.model("Tvdscustomer"),
  Joborder = mongoose.model("Joborder"),
  errorHandler = require("../../core/controllers/errors.server.controller"),
  lineChat = require("../../core/controllers/lineChat"),
  socket = require("../../../config/socket.io.js"),
  _ = require("lodash");

var weekday = new Array(7);
weekday[0] = "อาทิตย์";
weekday[1] = "จันทร์";
weekday[2] = "อังคาร";
weekday[3] = "พุธ";
weekday[4] = "พฤหัสบดี";
weekday[5] = "ศุกร์";
weekday[6] = "เสาร์";

var months = new Array(12);
months[0] = "ม.ค.";
months[1] = "ก.พ.";
months[2] = "มี.ค.";
months[3] = "เม.ย.";
months[4] = "พ.ค.";
months[5] = "มิ.ย.";
months[6] = "ก.ค.";
months[7] = "ส.ค.";
months[8] = "ก.ย.";
months[9] = "ต.ค.";
months[10] = "พ.ย.";
months[11] = "ธ.ค.";

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
      CHANNEL_ACCESS_TOKEN,
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
          CHANNEL_ACCESS_TOKEN,
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
        CHANNEL_ACCESS_TOKEN,
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
              CHANNEL_ACCESS_TOKEN,
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

exports.getAppointmentsIntent = async function (req, res, next) {
  if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ข้อมูลการนัดหมาย"
  ) {
    let messages = [
      {
        type: "flex",
        altText: "ตารางการนัดหมาย",
        contents: {
          type: "carousel",
          contents: [],
        },
      },
    ];
    var start = new Date(new Date().setDate(new Date().getDate()-1))//new Date();
    start.setHours(0, 0, 0, 0);
    console.log(start);
    Joborder.find({
      docdate: { $gte: start },
      "contactLists.lineUserId": req.body.events[0].source.userId,
    })
      .sort({ docdate: 1 })
      .exec(async function (err, results) {
        console.log(results.length);
        if (results.length > 0) {
          results.forEach((order) => {
            const me = order.contactLists.filter((contact) => {
              return (
                contact.lineUserId === `${req.body.events[0].source.userId}`
              );
            });

            console.log(me);

            let toDayTH = `${start.getDate() + 1} ${months[start.getMonth()]} ${
              start.getFullYear() + 543
            }`;

            let dateTH = `${order.docdate.getDate() + 1} ${
              months[order.docdate.getMonth()]
            } ${order.docdate.getFullYear() + 543}`;

            let sameToday = toDayTH === dateTH ? true : false;
            let isConfirmed = me[0].contactStatus === "confirm" ? true : false;

            let message = {
              type: "bubble",
              direction: "ltr",
              header: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: weekday[order.docdate.getDay() + 1],
                    size: "lg",
                    align: "start",
                    weight: "bold",
                    color: "#009813",
                  },
                  {
                    type: "text",
                    text: dateTH,
                    size: "3xl",
                    weight: "bold",
                    color: "#000000",
                  },
                  {
                    type: "text",
                    text: "ทะเบียนรถ: " + order.carNo.lisenceID,
                    size: "lg",
                    weight: "bold",
                    color: "#000000",
                  },
                  {
                    type: "text",
                    text: "คนขับรถ: " + order.carNo.driverInfo.displayName,
                    size: "xs",
                    color: "#B2B2B2",
                  },
                  {
                    type: "text",
                    text:
                      "สถานะ: " +
                      (me[0].contactStatus === "confirm"
                        ? "ยืนยันนัดหมาย"
                        : "ปฏิเสธนัดหมาย"),
                    margin: "lg",
                    size: "lg",
                    color: "#000000",
                  },
                ],
              },
              footer: {
                type: "box",
                layout: "horizontal",
                contents: [],
              },
            };

            if (!sameToday) {
              if (isConfirmed) {
                message.footer.contents.push({
                  type: "text",
                  text: "ยกเลิกนัดหมาย",
                  size: "lg",
                  align: "center",
                  color: "#FF0000",
                  action: {
                    type: "message",
                    label: "ยกเลิกนัดหมาย",
                    text:
                      "ปฏิเสธ วัน" +
                      weekday[order.docdate.getDay() + 1] +
                      "ที่: " +
                      dateTH +
                      " เลขเอกสาร: " +
                      order.docno,
                  },
                });
              } else {
                message.footer.contents.push({
                  type: "text",
                  text: "รับนัดหมาย",
                  size: "lg",
                  align: "center",
                  color: "#008000",
                  action: {
                    type: "message",
                    label: "รับนัดหมาย",
                    text:
                      "รับนัดหมาย วัน" +
                      weekday[order.docdate.getDay() + 1] +
                      "ที่: " +
                      dateTH +
                      " เลขเอกสาร: " +
                      order.docno,
                  },
                });
              }
            }
            message.footer.contents.push({
              type: "text",
              text: "ดูรายละเอียด",
              size: "lg",
              align: "center",
              color: "#0084B6",
              action: {
                type: "uri",
                label: "ดูรายละเอียด",
                uri: "line://app/1654060178-Pk1wOJB4",
              },
            });
            messages[0].contents.contents.push(message);
          });

          let reply = await lineChat.replyMessage(
            CHANNEL_ACCESS_TOKEN,
            req.body.events[0].replyToken,
            messages
          );
          res.jsonp({
            status: 200,
            data: req.body.events[0],
          });
        } else {
          messages = [
            {
              type: `text`,
              text: `ไม่มีการนัดหมายค่ะ`,
            },
          ];
          let reply = await lineChat.replyMessage(
            CHANNEL_ACCESS_TOKEN,
            req.body.events[0].replyToken,
            messages
          );
          res.jsonp({
            status: 200,
            data: req.body.events[0],
          });
        }
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
    let messages = [
      {
        type: "flex",
        altText: "ตารางการนัดหมาย",
        contents: {
          type: "carousel",
          contents: [],
        },
      },
    ];
    var start = new Date(new Date().setDate(new Date().getDate()-1))//new Date();
    start.setHours(0, 0, 0, 0);
    console.log(start);
    Joborder.find({
      docdate: { $gte: start },
      "carNo.driverInfo.lineUserId": req.body.events[0].source.userId,
    })
      .sort({ docdate: 1 })
      .exec(async function (err, results) {
        console.log(results.length);
        if (results.length > 0) {
          results.forEach((order) => {
            let dateTH = `${order.docdate.getDate() + 1} ${
              months[order.docdate.getMonth()]
            } ${order.docdate.getFullYear() + 543}`;

            let message = {
              type: "bubble",
              direction: "ltr",
              header: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: weekday[order.docdate.getDay() + 1],
                    size: "lg",
                    align: "start",
                    weight: "bold",
                    color: "#009813",
                  },
                  {
                    type: "text",
                    text: dateTH,
                    size: "3xl",
                    weight: "bold",
                    color: "#000000",
                  },
                  {
                    type: "text",
                    text: "ทะเบียนรถ: " + order.carNo.lisenceID,
                    size: "lg",
                    weight: "bold",
                    color: "#000000",
                  },
                  {
                    type: "text",
                    text: "คนขับรถ: " + order.carNo.driverInfo.displayName,
                    size: "xs",
                    color: "#B2B2B2",
                  },
                  // {
                  //   type: "text",
                  //   text:
                  //     "สถานะ: " +
                  //     (me[0].contactStatus === "confirm"
                  //       ? "ยืนยันนัดหมาย"
                  //       : "ปฏิเสธนัดหมาย"),
                  //   margin: "lg",
                  //   size: "lg",
                  //   color: "#000000",
                  // },
                ],
              },
              footer: {
                type: "box",
                layout: "horizontal",
                contents: [],
              },
            };

            message.footer.contents.push({
              type: "text",
              text: "ดูรายละเอียด",
              size: "lg",
              align: "center",
              color: "#0084B6",
              action: {
                type: "uri",
                label: "ดูรายละเอียด",
                uri: "line://app/1654060178-Pk1wOJB4",
              },
            });
            messages[0].contents.contents.push(message);
          });

          let reply = await lineChat.replyMessage(
            SATFF_CHANNEL_ACCESS_TOKEN,
            req.body.events[0].replyToken,
            messages
          );
          res.jsonp({
            status: 200,
            data: req.body.events[0],
          });
        } else {
          messages = [
            {
              type: `text`,
              text: `ไม่มีใบงานค่ะ`,
            },
          ];
          let reply = await lineChat.replyMessage(
            SATFF_CHANNEL_ACCESS_TOKEN,
            req.body.events[0].replyToken,
            messages
          );
          res.jsonp({
            status: 200,
            data: req.body.events[0],
          });
        }
      });
  } else {
    next();
  }
};

exports.fallbackIntent = function (req, res, next) {
  if (req.body.events[0].message.type === "text") {
    var newLineconnect = new Lineconnect({
      replyToken: req.body.events[0].replyToken,
      userId: req.body.events[0].source.userId,
      timestamp: req.body.events[0].timestamp,
      message: req.body.events[0].message.text,
      destination: req.body.destination,
    });
    newLineconnect.save(function (err, data) {
      if (err) {
        return res.status(400).send({
          status: 400,
          message: errorHandler.getErrorMessage(err),
        });
      } else {
        socket.io.emit("user-send-message", data);
        res.jsonp({
          status: 200,
          data: data,
        });
      }
    });
  } else {
    next();
  }
};

exports.completedChat = async function (req, res) {
  res.jsonp({
    status: 200,
    data: req.body.events[0],
  });
};

exports.pushMessage = async function (req, res) {
  let body = JSON.stringify(req.body);
  let push = await lineChat.pushMessage(CHANNEL_ACCESS_TOKEN, req.body);
  res.jsonp({
    status: 200,
    data: req.body,
  });
};

exports.replyMessage = async function (req, res) {
  let messages = [
    {
      type: `text`,
      text: `${req.body.message}`,
    },
  ];
  let reply = await lineChat.replyMessage(
    CHANNEL_ACCESS_TOKEN,
    req.body.replyToken,
    messages
  );
  // res.jsonp({
  //   status: 200,
  //   data: req.body.events[0],
  // });
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
        data: reply,
      });
    }
  });
};
