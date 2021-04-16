'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Sse = mongoose.model('Sse'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

var subscriptionList = [];

exports.getList = function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var query = {};
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
        Sse.find({}, {}, query, function (err, datas) {
            if (err) {
                return res.status(400).send({
                    status: 400,
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp({
                    status: 200,
                    data: datas
                });
            };
        });
};

exports.create = function (req, res) {
    var newSse = new Sse (req.body);
    newSse.createby = req.user;
    newSse.save(function (err, data) {
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

    Sse.findById(id, function (err, data) {
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
    var updSse = _.extend(req.data, req.body);
    updSse.updated = new Date();
    updSse.updateby = req.user;
    updSse.save(function (err, data) {
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


exports.eventHandler = function(req, res) {  
  try {

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    // Subscribe
    subscribe({
        request: req,
        response: res
      });   
    
    console.log('open event stream');
    console.log("subscribe count : " + subscriptionList.length);

    res.write('data: success connect\n\n');
 
    // console.log(req);
    req.on('close', () => {
      console.log('close sse');
      // delete out of subscription list and close connection
      unsubscribe(req);
      console.log("subscribe count : " +subscriptionList.length);
    })

  } catch(error) {
    console.log(error);
  }
}

exports.sendAllSubscriber = function(req, res) {
    let data = req.body;

    console.log('send subscribe');    
    console.log(subscriptionList.length);

    subscriptionList.forEach(item => {
        item.response.write(`data: ${JSON.stringify(data)}\n\n`);
    });

    res.jsonp({
        status: 200,
    });
  }

function subscribe(data) {
  subscriptionList.push(data);
}

function unsubscribe(req) {
  let index = subscriptionList.findIndex(item => item.request === req);

  if (index >= 0) {
    subscriptionList[index].response.end();
    subscriptionList.splice(index, 1);
  }
}


