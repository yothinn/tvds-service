'use strict';
var controller = require('../controllers/controller'),
    mq = require('../../core/controllers/rabbitmq'),
    policy = require('../policy/policy');
module.exports = function (app) {
    // var url = '/api/sses';
    // var urlWithParam = '/api/sses/:sseId';
    // app.route(url).all(policy.isAllowed)
    //     .get(controller.getList)
    //     .post(controller.create);

    // app.route(urlWithParam).all(policy.isAllowed)
    //     .get(controller.read)
    //     .put(controller.update)
    //     .delete(controller.delete);

    // app.param('sseId', controller.getByID);

    app
    .route("/api/tvds/sse/send")
    .all(policy.isAllowed)
    .post(controller.sendAllSubscriber);

  app
    .route("/api/tvds/sse/subscribe")
    .get(controller.eventHandler);

    /**
     * Message Queue
     * exchange : ชื่อเครือข่ายไปรษณีย์  เช่น casan
     * qname : ชื่อสถานีย่อย สาขา
     * keymsg : ชื่อผู้รับ
     */
    // mq.consume('exchange', 'qname', 'keymsg', (msg)=>{
    //     console.log(JSON.parse(msg.content));
        
    // });
}