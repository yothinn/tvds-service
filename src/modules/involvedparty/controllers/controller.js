"use strict";
var mongoose = require("mongoose"),
  model = require("../models/model"),
  mq = require("../../core/controllers/rabbitmq"),
  Involvedparty = mongoose.model("Involvedparty"),
  errorHandler = require("../../core/controllers/errors.server.controller"),
  _ = require("lodash"),
  request = require("request");

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
  Involvedparty.find({}, {}, query, function (err, datas) {
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
  var newInvolvedparty = new Involvedparty(req.body);
  newInvolvedparty.createby = req.user;
  newInvolvedparty.save(function (err, data) {
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

  Involvedparty.findById(id, function (err, data) {
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
  var updInvolvedparty = _.extend(req.data, req.body);
  updInvolvedparty.updated = new Date();
  updInvolvedparty.updateby = req.user;
  updInvolvedparty.save(function (err, data) {
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

exports.getUserProfile = (req, res, next) => {
  next();
};

exports.messageTypeText = (req, res, next) => {
  if (req.body.events[0].message.type === "text") {
    if(req.body.events[0].message.text.startswith("รับนัดหมาย")){
      req.replyBody = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        messages: [
          {
            type: `text`,
            text: `ระบบยืนยันนัดหมายของท่านเรียบร้อยครับ`,
          },
        ],
      });
    }else if(req.body.events[0].message.text.startswith("ปฏิเสธ")){
      req.replyBody = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        messages: [
          {
            type: `text`,
            text: `ขอบคุณครับ ไว้โอกาสหน้าจะนัดหมายมาใหม่นะครับ`,
          },
        ],
      });
    }else{
      switch (req.body.events[0].message.text) {
        case "ยืนยันการลงทะเบียน":
          req.replyBody = JSON.stringify({
            replyToken: req.body.events[0].replyToken,
            messages: [
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
            ],
          });
          break;
        default:
          req.replyBody = JSON.stringify({
            replyToken: req.body.events[0].replyToken,
            messages: [
              {
                type: `text`,
                text: `ผมเข้าใจคำสั่งเพียงบางคำสั่ง ตาม Rich Menu กรุณาเลือกทำรายการจาก Rich Menu`,
              },
            ],
          });
      }
    }
    next();
  } else {
    next();
  }
};

exports.messageTypeLocations = (req, res, next) => {
  if (req.body.events[0].message.type === "location") {
    let query = {
      "directContact.method": "lineUserId",
      "directContact.value": req.body.events[0].source.userId,
    };
    let update = {
      "contactAddress.latitude": `${req.body.events[0].message.latitude}`,
      "contactAddress.longitude": `${req.body.events[0].message.longitude}`,
    };
    Involvedparty.findOneAndUpdate(query, update, function (err, data) {
      req.replyBody = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        messages: [
          {
            type: `text`,
            text: `ขอบคุณสำหรับข้อมูลพิกัด`,
          },
        ],
      });
      next();
    });
  } else {
    next();
  }
};

exports.replyMessage = (req, res) => {
  let headers = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer 7bmSZYoiFA0K+GJGqft+YICRldOb/ONI3LeKdOx7o4FSIvrsHVRXkvrAaQKIz5vZP4oPJO7EO/8n6gFddEgBCa6MsvyVjQnCs/ADVaT83nDEJXn3KsXXvT2Vd1Hbx5H+Lc9QD3G7lXhpbVOz6LjgaAdB04t89/1O/w1cDnyilFU=",
  };
  request.post(
    {
      url: "https://api.line.me/v2/bot/message/reply",
      headers: headers,
      body:
        req.replyBody ||
        JSON.stringify({
          replyToken: req.body.events[0].replyToken,
          messages: [
            {
              type: `text`,
              text: `ขอบคุณสำหรับสิ่งดีๆที่มอบให้ครับ`,
            },
          ],
        }),
    },
    (err, resp, body) => {
      console.log("status = " + resp.statusCode);
      res.jsonp(req.body.events[0]);
    }
  );
};

exports.sendMessage = (req, res) => {
  let headers = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer 7bmSZYoiFA0K+GJGqft+YICRldOb/ONI3LeKdOx7o4FSIvrsHVRXkvrAaQKIz5vZP4oPJO7EO/8n6gFddEgBCa6MsvyVjQnCs/ADVaT83nDEJXn3KsXXvT2Vd1Hbx5H+Lc9QD3G7lXhpbVOz6LjgaAdB04t89/1O/w1cDnyilFU=",
  };
  let body = JSON.stringify(req.body);
  request.post(
    {
      url: "https://api.line.me/v2/bot/message/push",
      headers: headers,
      body: body,
    },
    (err, resp, body) => {
      console.log("status = " + resp.statusCode);
      res.jsonp({});
    }
  );
};

exports.query = function (req, res) {
  let query = null;
  if (req.body.lineUserId) {
    query = {
      "directContact.method": "lineUserId",
      "directContact.value": req.body.lineUserId,
    };
  }

  if (
    req.body.firstNameThai &&
    req.body.lastNameThai &&
    req.body.mobileNumber
  ) {
    query = {
      $or: [
        {
          "personalInfo.firstNameThai": req.body.firstNameThai,
          "personalInfo.lastNameThai": req.body.lastNameThai,
        },
        {
          "personalInfo.firstNameThai": req.body.firstNameThai,
          "directContact.method": "mobile",
          "directContact.value": req.body.mobileNumber,
        },
        {
          "personalInfo.lastNameThai": req.body.lastNameThai,
          "directContact.method": "mobile",
          "directContact.value": req.body.mobileNumber,
        },
      ],
    };
  }
  // console.log(query);
  if (!query) {
    res.jsonp({
      status: 200,
    });
  } else {
    Involvedparty.findOne(query, function (err, data) {
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
  }
};
