
request = require("request");


module.exports.replyMessage = function (channelAccessToken,replyToken, messages) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + channelAccessToken,
  };

  return new Promise((resolve, reject) => {
    request.post(
      {
        url: "https://api.line.me/v2/bot/message/reply",
        headers: headers,
        body: JSON.stringify({
          replyToken: replyToken,
          messages: messages,
        }),
      },
      (err, resp, body) => {
        if (err) {
          reject(err);
        }
        resolve(resp);
      }
    );
  });
};



module.exports.pushMessage = function (channelAccessToken,body) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + channelAccessToken,
  };

  return new Promise((resolve, reject) => {
    request.post(
      {
        url: "https://api.line.me/v2/bot/message/push",
        headers: headers,
        body: JSON.stringify(body),
      },
      (err, resp, body) => {
        if (err) {
          reject(err);
        }
        resolve(resp);
      }
    );
  });
};
