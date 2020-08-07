'use strict';
var controller = require('../controllers/controller'),
    mq = require('../../core/controllers/rabbitmq'),
    policy = require('../policy/policy');
module.exports = function (app) {
    // var url = '/api/reports';
    // var urlWithParam = '/api/reports/:reportId';
    // app.route(url).all(policy.isAllowed)
    //     .get(controller.getList)
    //     .post(controller.create);

    // app.route(urlWithParam).all(policy.isAllowed)
    //     .get(controller.read)
    //     .put(controller.update)
    //     .delete(controller.delete);

    // app.param('reportId', controller.getByID);

    // /api/report/sales/joborder
    // data in body
    app.route("/api/report/sales/joborder")
        .all(policy.isAllowed)
        .post(controller.getSalesReportByJoborder);

    // /api/report/sales/dates
    // data in body
    app.route("/api/report/sales/dates")
        .all(policy.isAllowed)
        .post(controller.getSalesReportByDates);

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