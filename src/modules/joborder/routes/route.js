"use strict";
var controller = require("../controllers/controller"),
  mq = require("../../core/controllers/rabbitmq"),
  policy = require("../policy/policy");
module.exports = function (app) {
  var url = "/api/joborders";
  var urlWithParam = "/api/joborders/:joborderId";
  app
    .route(url)
    .all(policy.isAllowed)
    .get(
      controller.getList
      // controller.sumStatusList,
      // controller.returnData
    )
    .post(controller.create);

  app
    .route(urlWithParam)
    .all(policy.isAllowed)
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete);

  app
    .route("/api/jobordersupdatemap")
    .all(policy.isAllowed)
    .post(
      controller.getCusData,
      controller.getJobOrder,
      controller.mapData,
      controller.updateJobOrderContactWithCusData,
      controller.returnData
    );

  app
    .route("/api/checkvalidjob")
    .all(policy.isAllowed)
    .post(controller.checkValidJob);

  // /api/jobordres/history/:customerId?size={number}
  app
    .route("/api/joborders/history/:customerId")
    .all(policy.isAllowed)
    .get(controller.getJoborderHistory);

  app.param("joborderId", controller.getByID);

  /**
   * Message Queue
   * exchange : ชื่อเครือข่ายไปรษณีย์  เช่น casan
   * qname : ชื่อสถานีย่อย สาขา
   * keymsg : ชื่อผู้รับ
   */
  // mq.consume('exchange', 'qname', 'keymsg', (msg)=>{
  //     console.log(JSON.parse(msg.content));

  // });
};
