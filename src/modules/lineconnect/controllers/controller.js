"use strict";
var mongoose = require("mongoose"),
  model = require("../models/model"),
  mq = require("../../core/controllers/rabbitmq"),
  Lineconnect = mongoose.model("Lineconnect"),
  Tvdscustomer = mongoose.model("Tvdscustomer"),
  Joborder = mongoose.model("Joborder"),
  errorHandler = require("../../core/controllers/errors.server.controller"),
  lineChat = require("../../core/controllers/lineChat"),
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

      let reply = await lineChat.replyMessage(
        req.body.events[0].replyToken,
        messages
      );
      res.jsonp({
        status: 200,
        data: req.body.events[0],
      });

      //   Joborder.findOne(
      //     { docno: arrMsg[2].trim() },
      //     async (err, order) => {
      //       if (err) {
      //         messages.push({
      //           type: `text`,
      //           text: `เกิดข้อผิดพลาดในการยืนยันนัดหมาย! กรุณาติดต่อกลับหาเรา`,
      //         });
      //       } else {
      //         if (req.body.events[0].message.text.startsWith("รับนัดหมาย")) {
      //           messages.push({
      //             type: `text`,
      //             text: `ระบบยืนยันนัดหมายของท่านเรียบร้อยครับ`,
      //           });
      //         } else {
      //           messages.push({
      //             type: `text`,
      //             text: `ขอบคุณครับ ไว้โอกาสหน้าจะนัดหมายมาใหม่นะครับ`,
      //           });
      //         }
      //       }
      //       let reply = await lineChat.replyMessage(
      //         req.body.events[0].replyToken,
      //         messages
      //       );
      //       res.jsonp({
      //         status: 200,
      //         data: req.body.events[0],
      //       });
      //     }
      //   );
    }
  } else {
    next();
  }
};

exports.fallbackIntent = function (req, res, next) {
  next();
};

exports.completedChat = function (req, res) {
  res.jsonp({
    status: 200,
    data: req.body.events[0],
  });
};
