"use strict";
var mongoose = require("mongoose"),
  model = require("../models/model"),
  mq = require("../../core/controllers/rabbitmq"),
  Vehiclestaff = mongoose.model("Vehiclestaff"),
  errorHandler = require("../../core/controllers/errors.server.controller"),
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
  Vehiclestaff.find({}, {}, query, function (err, datas) {
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
  var newVehiclestaff = new Vehiclestaff(req.body);

  if (req.user) {
    newVehiclestaff.createby = req.user;
  } else {
    newVehiclestaff.createby = {
      username: "Line:" + newVehiclestaff.lineUserId,
      displayname: "Line:" + newVehiclestaff.lineUserId,
    };
  }
  newVehiclestaff.displayName =
    newVehiclestaff.firstName + " " + newVehiclestaff.lastName;
  newVehiclestaff.save(function (err, data) {
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

  Vehiclestaff.findById(id, function (err, data) {
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
  var updVehiclestaff = _.extend(req.data, req.body);
  updVehiclestaff.updated = new Date();
  if (req.user) {
    updVehiclestaff.updateby = req.user;
  } else {
    updVehiclestaff.updateby = {
      username: "Line:" + updVehiclestaff.lineUserId,
      displayname: "Line:" + updVehiclestaff.lineUserId,
    };
  }

  updVehiclestaff.displayName =
    updVehiclestaff.firstName + " " + updVehiclestaff.lastName;
  updVehiclestaff.save(function (err, data) {
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

exports.query = function (req, res) {
  let query = null;
  if (req.body.lineUserId) {
    query = {
      lineUserId: req.body.lineUserId,
    };
  }

  if (!query) {
    res.jsonp({
      status: 200,
    });
  } else {
    Vehiclestaff.findOne(query, function (err, data) {
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
