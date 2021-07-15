const request = require("request");

module.exports = {
  currentComic: function () {
    return new Promise((resolve, reject) => {
      request(
        "http://xkcd.com/info.0.json",
        { json: true },
        (err, res, body) => {
          if (err) reject(err);
          if (res.statusCode > 400) reject(res.statusMessage);
          else resolve(body);
        }
      );
    });
  },
  getComicById: function (id) {
    return new Promise((resolve, reject) => {
      request(
        `http://xkcd.com/${id}/info.0.json`,
        { json: true },
        (err, res, body) => {
          if (err) reject(err);
          if (res.statusCode > 400) reject(res.statusMessage);
          else resolve(body);
        }
      );
    });
  },
  currentComicNum: function () {
    return new Promise((resolve, reject) => {
      request(
        "http://xkcd.com/info.0.json",
        { json: true },
        (err, res, body) => {
          if (err) reject(err);
          if (res.statusCode > 400) reject(res.statusMessage);
          else {
            resolve(body.num);
          }
        }
      );
    });
  },
};
