"use strict";
var mongoose = require("mongoose"),
  model = require("../models/model"),
  mq = require("../../core/controllers/rabbitmq"),
  Order = mongoose.model("Order"),
  Involvedparty = mongoose.model("Involvedparty"),
  errorHandler = require("../../core/controllers/errors.server.controller"),
  _ = require("lodash");

exports.getList = function (req, res, next) {
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
  Order.find({}, {}, query, function (err, datas) {
    if (err) {
      return res.status(400).send({
        status: 400,
        message: errorHandler.getErrorMessage(err),
      });
    } else {
      req.orderDatas = datas;
      next();
    }
  });
};

exports.sumStatusList = function (req, res, next) {
  // console.log(req.orderDatas)
  var orderDatas = req.orderDatas;
  var newOrderDatas = [];

  for (let i = 0; i < orderDatas.length; i++) {
    const orderData = orderDatas[i];

    var confirmCount = 0;
    var rejectCount = 0;
    for (let j = 0; j < orderData.contactLists.length; j++) {
      const listData = orderData.contactLists[j];
      if (listData.contactStatus === "confirm") {
        confirmCount += 1;
      }
      if (listData.contactStatus === "reject") {
        rejectCount += 1;
      }
    }

    var newData = {
      _id: orderData._id,
      docno: orderData.docno,
      docdate: orderData.docdate,
      carNo: orderData.carNo,
      orderStatus: orderData.orderStatus,
      cusAmount: orderData.cusAmount,
      confirmCount: confirmCount,
      rejectCount: rejectCount,
    };
    newOrderDatas.push(newData);
  }

  req.returnData = newOrderDatas;
  next();
};

exports.create = function (req, res) {
  var newOrder = new Order(req.body);
  newOrder.createby = req.user;
  newOrder.save(function (err, data) {
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

  Order.findById(id, function (err, data) {
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
  var updOrder = _.extend(req.data, req.body);
  updOrder.updated = new Date();
  updOrder.updateby = req.user;
  updOrder.save(function (err, data) {
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

exports.getIpiData = function (req, res, next) {
  Involvedparty.find(
    {
      "membership.activity": "delivery",
      "contactAddress.latitude": { $ne: null },
    },
    function (err, datas) {
      // console.log(datas);
      var ipiUseData = [];
      //วนรอบแรก
      for (let i = 0; i < datas.length; i++) {
        const data = datas[i];
        // console.log(data._id);
        //วน membership
        //   for (let j = 0; j < data.membership.length; j++) {
        //     const member = data.membership[j];
        //     // console.log(member);
        //     if (member.activity === "delivery") {
        //       ipiUseData.push({
        //         _id: data._id,
        //         docno: "",
        //         contactStatus: "",
        //         personalInfo: data.personalInfo,
        //         directContact: data.directContact,
        //         contactAddress: data.contactAddress,
        //         membership: data.membership,
        //       });
        //       break; //เข้าเงื่อนไขอย่างไหน ให้ออกลูปทันที
        //     }
        //   }
        let bgColor = "ff2a2a";
        data.membership.forEach((member) => {
          if (member.activity === "shareholder") {
            bgColor = "167eff"; //สีน้ำเงิน
          }
        });
        let label = "";
        ipiUseData.push({
          _id: data._id,
          docno: "",
          contactStatus: "",
          icon: {
            url: `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=4&color=fff&background=${bgColor}&name=${label}`,
            scaledSize: {
              width: 34,
              height: 34,
            },
          },
          personalInfo: data.personalInfo,
          directContact: data.directContact,
          contactAddress: data.contactAddress,
          membership: data.membership,
        });
      }
      // console.log(ipiUseData);
      req.ipiData = ipiUseData;
      next();
    }
  );
};

exports.getOrder = function (req, res, next) {
  var docdate = req.body.docdate;
  Order.find({ docdate: docdate }, function (err, datas) {
    req.orderByDate = datas;
    next();
  });
};

exports.mapData = function (req, res, next) {
  var ipiDatas = req.ipiData;
  var orderDatas = req.orderByDate;
  // console.log(ipiDatas);
  // console.log(orderDatas);

  //วนตาม Order
  if (orderDatas.length > 0) {
    // console.log('have orderDatas')
    for (let i = 0; i < orderDatas.length; i++) {
      const orderData = orderDatas[i];
      //วนหา contactLists
      for (let j = 0; j < orderData.contactLists.length; j++) {
        const contactList = orderData.contactLists[j];

        // console.log(contactList);

        let ipiIndex = ipiDatas.findIndex((item) => {
          return item._id.toString() === contactList._id.toString();
        });
        // console.log(ipiIndex);

        if (ipiIndex !== -1) {
          ipiDatas[ipiIndex].docno = orderData.docno;
          ipiDatas[ipiIndex].contactStatus = contactList.contactStatus;
          let status = checkSymbolMarkersDefault(contactList.contactStatus);
          ipiDatas[
            ipiIndex
          ].icon.url = `${ipiDatas[ipiIndex].icon.url}${status}`;
        }
      }
    }
  }

  // console.log(ipiDatas)
  req.returnData = ipiDatas;
  next();
};

function checkSymbolMarkersDefault(contactStatus) {
  if (contactStatus === "waitapprove") {
    return "W";
  }
  if (contactStatus === "confirm") {
    return "C";
  }
  if (contactStatus === "reject") {
    return "R";
  }
  if (contactStatus === "select") {
    return "S";
  }
  if (contactStatus === "") {
    return "";
  }
}

exports.returnData = function (req, res) {
  res.jsonp({
    status: 200,
    data: req.returnData ? req.returnData : [],
  });
};
