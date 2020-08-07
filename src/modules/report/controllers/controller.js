'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    // Report = mongoose.model('Report'),
    Joborder = mongoose.model("Joborder"),
    Tvdscustomer = mongoose.model("Tvdscustomer"),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    moment = require("moment"),
    _ = require('lodash');

const REPORT_PAGESIZE = 10;

/**
 * Get sales report by each joborder
* /api/report/sales/joborder
*  body {
*       startDate: date,
*       endDate: date,
*       page: number,
*       size: number
*  }
* !! Be careful : startDate and endDate is universal Time zone
* Default size is 10;
*/
exports.getSalesReportByJoborder = function (req, res) {

    let startDate, endDate;
    let page = parseInt(req.body.page) || 1;
    let size = parseInt(req.body.size) || REPORT_PAGESIZE;
    
    // Check start date is null or valid
    if (moment(req.body.startDate).isValid()) {
        startDate = new Date(req.body.startDate)
     } else {
        return res.status(400).send({
            status: 400,
            message: "Start date invalid",
          });
     } 

    // Check end date is null or valid
    if (moment(req.body.endDate).isValid()) { 
        endDate = new Date(req.body.endDate);
     } else {
        return res.status(400).send({
            status: 400,
            message: "End date invalid",
          });
     } 
    
    // endDate must greater than startDate
    if (endDate < startDate) {
        return res.status(400).send({
            status: 400,
            message: "Invalid : end date less than start date ",
          });
    }

    // console.log(req.body);
    // console.log(startDate);
    // console.log(endDate);
    // console.log(page);
    
    Joborder.aggregate()
        .match({ docdate : { $gte: startDate, $lte: endDate } })    // filter date
        .project({
            _id: "$_id",
            docdate: "$docdate",
            docno: "$docno",
            carNo: "$carNo",
            orderStatus: "orderStatus",
            salesAmount: {                                          // summary sales in contactLists
                $sum : "$contactLists.sales"
            }
        })
        .skip(size * (page - 1))
        .limit(size)
        .sort( {docdate : -1} )
        .exec(function(err, result) {
            // console.log(result);
            if (err) {
                return res.status(400).send({
                  status: 400,
                  message: errorHandler.getErrorMessage(err),
                });
            } else {
                res.jsonp({
                  status: 200,
                  data: result,
                });
            } 
        })
    
};

/**
 * Get sales report by date
* /api/report/sales/dates
*  body {
*       startDate: date,
*       endDate: date,
*       page: number,
*  }
* !! Be careful : startDate and endDate is universal Time zone
* Default size is 10;
*/

exports.getSalesReportByDates = function (req, res) {
    let startDate, endDate;
    let page = parseInt(req.body.page) || 1;
    let size = parseInt(req.body.size) || REPORT_PAGESIZE;
    
    // Check start date is null or valid 
    if (moment(req.body.startDate).isValid()) {
        startDate = new Date(req.body.startDate)
     } else {
        return res.status(400).send({
            status: 400,
            message: "Start date invalid",
          });
     } 

    // Check end date is null or valid
    if (moment(req.body.endDate).isValid()) { 
        endDate = new Date(req.body.endDate);
    } else {
        return res.status(400).send({
            status: 400,
            message: "End date invalid",
          });
    } 
   
    // endDate must greater than startDate
    if (endDate < startDate) {
        return res.status(400).send({
            status: 400,
            message: "Invalid : end date less than start date",
          });
    }

    // console.log(req.body);
    // console.log(startDate);
    // console.log(endDate);
    // console.log(page);

    Joborder.aggregate()
        .match({ docdate : { $gte: startDate, $lte: endDate } })    // filter date
        .unwind("contactLists")
        .group({
            _id: "$docdate",
            //docdate: "$docdate",
            salesAmount: {
                $sum : "$contactLists.sales"
            }
        })
        .skip(size * (page - 1))
        .limit(size)
        .sort({docdate : 1})
        .exec(function(err, result) {
            // console.log(result);
            if (err) {
                return res.status(400).send({
                    status: 400,
                    message: errorHandler.getErrorMessage(err),
                });
            } else {
                res.jsonp({
                    status: 200,
                    data: result,
                });
            } 
        })
};

// exports.getList = function (req, res) {
//     var pageNo = parseInt(req.query.pageNo);
//     var size = parseInt(req.query.size);
//     var query = {};
//     if (pageNo < 0 || pageNo === 0) {
//         response = { "error": true, "message": "invalid page number, should start with 1" };
//         return res.json(response);
//     }
//     query.skip = size * (pageNo - 1);
//     query.limit = size;
//         Report.find({}, {}, query, function (err, datas) {
//             if (err) {
//                 return res.status(400).send({
//                     status: 400,
//                     message: errorHandler.getErrorMessage(err)
//                 });
//             } else {
//                 res.jsonp({
//                     status: 200,
//                     data: datas
//                 });
//             };
//         });
// };

// exports.create = function (req, res) {
//     var newReport = new Report (req.body);
//     newReport.createby = req.user;
//     newReport.save(function (err, data) {
//         if (err) {
//             return res.status(400).send({
//                 status: 400,
//                 message: errorHandler.getErrorMessage(err)
//             });
//         } else {
//             res.jsonp({
//                 status: 200,
//                 data: data
//             });
//             /**
//              * Message Queue
//              */
//             // mq.publish('exchange', 'keymsg', JSON.stringify(newOrder));
//         };
//     });
// };

// exports.getByID = function (req, res, next, id) {

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).send({
//             status: 400,
//             message: 'Id is invalid'
//         });
//     }

//     Report.findById(id, function (err, data) {
//         if (err) {
//             return res.status(400).send({
//                 status: 400,
//                 message: errorHandler.getErrorMessage(err)
//             });
//         } else {
//             req.data = data ? data : {};
//             next();
//         };
//     });
// };

// exports.read = function (req, res) {
//     res.jsonp({
//         status: 200,
//         data: req.data ? req.data : []
//     });
// };

// exports.update = function (req, res) {
//     var updReport = _.extend(req.data, req.body);
//     updReport.updated = new Date();
//     updReport.updateby = req.user;
//     updReport.save(function (err, data) {
//         if (err) {
//             return res.status(400).send({
//                 status: 400,
//                 message: errorHandler.getErrorMessage(err)
//             });
//         } else {
//             res.jsonp({
//                 status: 200,
//                 data: data
//             });
//         };
//     });
// };

// exports.delete = function (req, res) {
//     req.data.remove(function (err, data) {
//         if (err) {
//             return res.status(400).send({
//                 status: 400,
//                 message: errorHandler.getErrorMessage(err)
//             });
//         } else {
//             res.jsonp({
//                 status: 200,
//                 data: data
//             });
//         };
//     });
// };
