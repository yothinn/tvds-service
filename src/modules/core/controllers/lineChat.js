const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN || '4A287j6ijUzndwahgTuuucdZTEJOUN/hxlsEX/kjr6WlpPxxxYogNRcx+sZfhfTETeLeLy2jP67GcrOz1AsoJaPkL8t/Pfn+8ZeAYHliSBV3FJNcoVPbodNseuO3sQdAmdxaFFK5TohdUAa3b7UmKQdB04t89/1O/w1cDnyilFU=';

module.exports.replyMessage = function (replyToken, messages) {
  let headers = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer " + CHANNEL_ACCESS_TOKEN,
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Delay Hello");
    }, 1000);
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
