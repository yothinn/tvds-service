"use strict";
var mongoose = require("mongoose"),
  model = require("../models/model"),
  mq = require("../../core/controllers/rabbitmq"),
  Joborder = mongoose.model("Joborder"),
  Tvdscustomer = mongoose.model("Tvdscustomer"),
  errorHandler = require("../../core/controllers/errors.server.controller"),
  _ = require("lodash");

exports.getList = async function (req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var size = parseInt(req.query.size);
  var keyword = req.query.keyword;
  var orderBy = req.query.orderBy;
  var orderDir = req.query.orderDir;
  var sortSign = -1;
  var sort = { docdate: -1 };

  if (pageNo < 0 || pageNo === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1",
    };
    return res.json(response);
  }

  if (orderDir) {
    sortSign = orderDir === "asc" ? 1 : -1;
  }

  switch (orderBy) {
    case "docno":
      // code block
      sort = { docno: sortSign };
      break;
    case "docdate":
      // code block
      sort = { docdate: sortSign };
      break;
    case "created":
      // code block
      sort = { created: sortSign };
      break;
    case "carNo":
      // code block
      sort = { "carNo.lisenceID": sortSign };
      break;
    case "orderStatus":
      // code block
      sort = { orderStatus: sortSign };
      break;
    case "cusAmount":
      sort = { cusAmount: sortSign };
      break;
  }

  let orderStatus = "";

  let filter = {};
  if (keyword) {
    if ("จัดเส้นทาง".startsWith(keyword)) orderStatus = "draft";
    if ("รอบืนยัน".startsWith(keyword)) orderStatus = "waitapprove";
    if ("ใบงานพ้อม".startsWith(keyword)) orderStatus = "orderavailable";
    if ("เตรียมการบริการ".startsWith(keyword)) orderStatus = "serviceprepared";
    if ("กำลังให้บริการ".startsWith(keyword)) orderStatus = "golive";
    if ("ยกเลิกใบงาน".startsWith(keyword)) orderStatus = "ordercancel";
    if ("จบบริการยกเลิก)".startsWith(keyword))
      orderStatus = "closewithcondition";
    if ("จบบริการ".startsWith(keyword)) orderStatus = "close";

    filter = {
      $or: [
        {
          docno: { $regex: "^" + keyword, $options: "i" },
        },
        {
          "carNo.lisenceID": { $regex: "^" + keyword, $options: "i" },
        },
        {
          "carNo.driverInfo.firstName": {
            $regex: "^" + keyword,
            $options: "i",
          },
        },
        {
          "carNo.driverInfo.lastName": {
            $regex: "^" + keyword,
            $options: "i",
          },
        },
        {
          orderStatus: { $regex: "^" + orderStatus, $options: "i" },
        },
      ],
    };
  }

  console.log(keyword);

  console.log(filter);

  console.log(orderBy);
  console.log(sortSign);
  
  const [_results, _count] = await Promise.all([
    Joborder.find(filter)
      .skip(size * (pageNo - 1))
      .limit(size)
      .sort(sort)
      .exec(),
    Joborder.countDocuments(filter).exec(),
  ]);

  // _results.forEach((rec)=>{
  //   rec.confirmCount = 1;
  //   rec.rejectCount = 2;
  // })
  var newJobOrderDatas = [];
  await Promise.all(
    _results.map(async (jobOrderData) => {
      let confirmArray = jobOrderData.contactLists.filter((contact) => {
        return contact.contactStatus === "confirm";
      });
      let rejectArray = jobOrderData.contactLists.filter((contact) => {
        return contact.contactStatus === "reject";
      });
      var confirmCount = confirmArray.length;
      var rejectCount = rejectArray.length;
      var newData = {
        _id: jobOrderData._id,
        docno: jobOrderData.docno,
        docdate: jobOrderData.docdate,
        carNo: jobOrderData.carNo,
        orderStatus: jobOrderData.orderStatus,
        cusAmount: jobOrderData.cusAmount,
        confirmCount: confirmCount,
        rejectCount: rejectCount,
      };
      newJobOrderDatas.push(newData);
    })
  );

  res.json({
    status: 200,
    currentPage: pageNo,
    pages: Math.ceil(_count / size),
    currentCount: _results.length,
    totalCount: _count,
    data: newJobOrderDatas,
  });

  // var query = {};
  // query.skip = size * (pageNo - 1);
  // query.limit = size;
  // Joborder.find({}, {}, query, function (err, datas) {
  //     if (err) {
  //         return res.status(400).send({
  //             status: 400,
  //             message: errorHandler.getErrorMessage(err)
  //         });
  //     } else {
  //         req.jobOrderDatas = datas;
  //         next();
  //     };
  // });
};

exports.sumStatusList = function (req, res, next) {
  // console.log(req.jobOrderDatas)
  var jobOrderDatas = req.jobOrderDatas;
  var newJobOrderDatas = [];

  for (let i = 0; i < jobOrderDatas.length; i++) {
    const jobOrderData = jobOrderDatas[i];

    var confirmCount = 0;
    var rejectCount = 0;
    for (let j = 0; j < jobOrderData.contactLists.length; j++) {
      const listData = jobOrderData.contactLists[j];
      if (listData.contactStatus === "confirm") {
        confirmCount += 1;
      }
      if (listData.contactStatus === "reject") {
        rejectCount += 1;
      }
    }

    var newData = {
      _id: jobOrderData._id,
      docno: jobOrderData.docno,
      docdate: jobOrderData.docdate,
      carNo: jobOrderData.carNo,
      orderStatus: jobOrderData.orderStatus,
      cusAmount: jobOrderData.cusAmount,
      confirmCount: confirmCount,
      rejectCount: rejectCount,
    };
    newJobOrderDatas.push(newData);
  }

  req.returnData = newJobOrderDatas;
  next();
};

exports.create = function (req, res) {
  var newJoborder = new Joborder(req.body);
  newJoborder.createby = req.user;
  newJoborder.save(function (err, data) {
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

  Joborder.findById(id, function (err, data) {
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
  var updJoborder = _.extend(req.data, req.body);
  updJoborder.updated = new Date();
  updJoborder.updateby = req.user;
  updJoborder.save(function (err, data) {
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

exports.getCusData = function (req, res, next) {
  Tvdscustomer.find(
    { latitude: { $ne: "" }, longitude: { $ne: "" } },
    function (err, datas) {
      var cusUseData = [];

      for (let i = 0; i < datas.length; i++) {
        const data = datas[i];

        let bgColor = "ff2a2a";
        if (data.isShareHolder === true) {
          bgColor = "167eff"; //สีน้ำเงิน
        }

        let label = "";

        cusUseData.push({
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
          isShareHolder: data.isShareHolder,
          title: data.title,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          persanalId: data.persanalId,
          mobileNo1: data.mobileNo1,
          mobileNo2: data.mobileNo2,
          mobileNo3: data.mobileNo3,
          addressLine1: data.addressLine1,
          addressStreet: data.addressStreet,
          addressSubDistrict: data.addressSubDistrict,
          addressDistrict: data.addressDistrict,
          addressProvince: data.addressProvince,
          addressPostCode: data.addressPostCode,
          lineUserId: data.lineUserId,
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
      // console.log(cusUseData);
      req.cusData = cusUseData;
      next();
    }
  );
};

exports.getJobOrder = function (req, res, next) {
  var docdate = req.body.docdate;
  Joborder.find({ docdate: docdate }, function (err, datas) {
    var jobUseDatas = [];

    datas.forEach((el) => {
      if (el.orderStatus !== "ordercancel") {
        jobUseDatas.push(el)
      };
    });

    req.jobOrderByDate = jobUseDatas;
    next();
  });
};

exports.mapData = function (req, res, next) {
  var cusDatas = req.cusData;
  var jobOrderDatas = req.jobOrderByDate;
  // console.log(cusDatas);
  // console.log(jobOrderDatas);

  //วนตาม Order
  if (jobOrderDatas.length > 0) {
    for (let i = 0; i < jobOrderDatas.length; i++) {
      const jobOrderData = jobOrderDatas[i];
      // console.log(jobOrderData)

      //วนหา contactLists
      for (let j = 0; j < jobOrderData.contactLists.length; j++) {
        const contactList = jobOrderData.contactLists[j];
        // console.log(contactList);

        let cusIndex = cusDatas.findIndex((item) => {
          return item._id.toString() === contactList._id.toString();
        });
        // console.log(cusIndex);

        if (cusIndex !== -1) {
          cusDatas[cusIndex].docno = jobOrderData.docno;
          cusDatas[cusIndex].contactStatus = contactList.contactStatus;

          contactList.lineUserId = cusDatas[cusIndex].lineUserId;

          let status = checkSymbolMarkersDefault(contactList.contactStatus);
          cusDatas[
            cusIndex
          ].icon.url = `${cusDatas[cusIndex].icon.url}${status}`;
        }
      }
    }
  }

  // // console.log(cusDatas)
  req.jobOrderData = jobOrderDatas;
  req.returnData = cusDatas;
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
  if (contactStatus === "select" || contactStatus === "waitcontact") {
    return "S";
  }
  if (contactStatus === "") {
    return "";
  }
}

exports.updateJobOrderContactWithCusData = async function (req, res, next) {
  // console.log(req.jobOrderByDate)
  const promise = req.jobOrderByDate.map(async (jobOrder, idx) => {
    // console.log(Joborder)
    jobOrder.save(function (err, data) {
      // console.log(data)
    });
  });

  await Promise.all(promise);
  next();
};

exports.returnData = function (req, res) {
  res.jsonp({
    status: 200,
    data: req.returnData ? req.returnData : [],
  });
};

exports.checkValidJob = function (req, res) {
  Joborder.find(
    {
      docdate: req.body.docdate,
      "carNo.lisenceID": req.body.lisenceID,
      $or: [
        { orderStatus: "draft" },
        { orderStatus: "waitapprove" },
        { orderStatus: "orderavailable" },
        { orderStatus: "serviceprepared" },
        { orderStatus: "golive" },
      ],
    },
    function (err, data) {
      res.jsonp({
        status: 200,
        data: data,
      });
    }
  );
};
