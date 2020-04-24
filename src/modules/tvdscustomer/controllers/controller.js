'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Tvdscustomer = mongoose.model('Tvdscustomer'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    moment = require('moment'),
    _ = require('lodash');

exports.getList = async function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var keyword = req.query.keyword;

    if (pageNo < 0 || pageNo === 0) {
        response = {
            error: true,
            message: "invalid page number, should start with 1",
        };
        return res.json(response);
    }

    let filter = {};
    if (keyword) {
        filter = {
            $or: [
                {
                    "firstName": { $regex: "^" + keyword, $options: "i", },
                },
                {
                    "lastName": { $regex: "^" + keyword, $options: "i" },
                },
                {
                    "addressStreet": { $regex: "^" + keyword, $options: "i", },
                },
                {
                    "addressSubDistrict": { $regex: "^" + keyword, $options: "i", },
                },
                {
                    "addressDistrict": { $regex: "^" + keyword, $options: "i", },
                },
                {
                    "addressProvince": { $regex: "^" + keyword, $options: "i", },
                },
                {
                    "addressPostCode": { $regex: "^" + keyword, $options: "i", },
                },
                {
                    "mobileNo1": { $regex: "^" + keyword, $options: "i" },
                },
                // {
                //     "created": { $regex: "^" + keyword, $options: "i" },
                // },
                // {
                //     "updated": { $regex: "^" + keyword, $options: "i" },
                // },
            ],
        };
    }

    const [_results, _count] = await Promise.all([
        Tvdscustomer.find(filter)
            .skip(size * (pageNo - 1))
            .limit(size)
            .sort({ "firstName": 1 })
            .exec(),
        Tvdscustomer.countDocuments(filter).exec(),
    ]);

    return res.json({
        status: 200,
        currentPage: pageNo,
        pages: Math.ceil(_count / size),
        currentCount: _results.length,
        totalCount: _count,
        data: _results,
    });
    // var query = {};
    // if (pageNo < 0 || pageNo === 0) {
    //     response = { "error": true, "message": "invalid page number, should start with 1" };
    //     return res.json(response);
    // }
    // query.skip = size * (pageNo - 1);
    // query.limit = size;
    // Tvdscustomer.find({}, {}, query, function (err, datas) {
    //     if (err) {
    //         return res.status(400).send({
    //             status: 400,
    //             message: errorHandler.getErrorMessage(err)
    //         });
    //     } else {
    //         res.jsonp({
    //             status: 200,
    //             data: datas
    //         });
    //     };
    // });
};

exports.create = function (req, res) {
    var newTvdscustomer = new Tvdscustomer(req.body);
    newTvdscustomer.createby = req.user;
    newTvdscustomer.displayName = newTvdscustomer.firstName + ' ' + newTvdscustomer.lastName;
    newTvdscustomer.save(function (err, data) {
        // console.log(data);
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
            /**
             * Message Queue
             */
            // mq.publish('exchange', 'keymsg', JSON.stringify(newOrder));
        };
    });
};

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Tvdscustomer.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updTvdscustomer = _.extend(req.data, req.body);
    updTvdscustomer.updated = new Date();
    updTvdscustomer.updateby = req.user;
    updTvdscustomer.displayName = updTvdscustomer.firstName + ' ' + updTvdscustomer.lastName;
    updTvdscustomer.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.query = function (req, res) {
    let query = null;
    if (req.body.lineUserId) {
        query = {
            "lineUserId": req.body.lineUserId,
        };
    }

    if (
        req.body.firstName &&
        req.body.lastName &&
        req.body.mobileNo1
    ) {
        query = {
            $or: [
                {
                    "firstName": req.body.firstName,
                    "lastName": req.body.lastNam,
                },
                {
                    "firstName": req.body.firstName,
                    "mobileNo1": req.body.mobileNo1,
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
        Tvdscustomer.findOne(query, function (err, data) {
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
