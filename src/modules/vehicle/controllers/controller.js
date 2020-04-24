'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Vehicle = mongoose.model('Vehicle'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = async function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var keyword = req.query.keyword;
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response);
    }

    let filter = {};
    if (keyword) {
        filter = {
            $or: [
                {
                    "lisenceID": { $regex: "^" + keyword, $options: "i", },
                },
                {
                    "driverInfo.displayName": { $regex: "^" + keyword, $options: "i" },
                }
            ],
        };
    }

    const [_results, _count] = await Promise.all([
        Vehicle.find(filter)
            .skip(size * (pageNo - 1))
            .limit(size)
            .sort({ "firstName": 1 })
            .exec(),
            Vehicle.countDocuments(filter).exec(),
    ]);

    return res.json({
        status: 200,
        currentPage: pageNo,
        pages: Math.ceil(_count / size),
        currentCount: _results.length,
        totalCount: _count,
        data: _results,
    });
};

exports.create = function (req, res) {
    var newVehicle = new Vehicle(req.body);
    newVehicle.createby = req.user;
    newVehicle.save(function (err, data) {
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

    Vehicle.findById(id, function (err, data) {
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
    var updVehicle = _.extend(req.data, req.body);
    updVehicle.updated = new Date();
    updVehicle.updateby = req.user;
    updVehicle.save(function (err, data) {
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
