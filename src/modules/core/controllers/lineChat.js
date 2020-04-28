const CHANNEL_ACCESS_TOKEN =
  process.env.CHANNEL_ACCESS_TOKEN ||
  "4A287j6ijUzndwahgTuuucdZTEJOUN/hxlsEX/kjr6WlpPxxxYogNRcx+sZfhfTETeLeLy2jP67GcrOz1AsoJaPkL8t/Pfn+8ZeAYHliSBV3FJNcoVPbodNseuO3sQdAmdxaFFK5TohdUAa3b7UmKQdB04t89/1O/w1cDnyilFU=";

  const SATFF_CHANNEL_ACCESS_TOKEN =
  process.env.SATFF_CHANNEL_ACCESS_TOKEN ||
  "d4OEgim58yaNBFoyL0MfAzK2OdzR7+K+bDw0rBCD6ustrWhGqJX5EvKxcWU3RJvDJ+EdRlPwmOQWPCNXO1KT1J2IzqC7H6+KXcD9BsJBKr4j1E15mvZ9zwaPSwK2YoXOGAJSoWovSQq53wD3iPWlegdB04t89/1O/w1cDnyilFU=";
request = require("request");


module.exports.replyMessage = function (replyToken, messages) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
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

module.exports.replyStaffMessage = function (replyToken, messages) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + SATFF_CHANNEL_ACCESS_TOKEN,
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

module.exports.pushMessage = function (body) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
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
