const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

let mongoDBConnectionString =
  "mongodb+srv://Daniil:AfpwY9cNymNDPHLo@cluster0.6baqj.mongodb.net/Data?retryWrites=true&w=majority";
// process.env.MONGO_URL;

let Schema = mongoose.Schema;

let viewsSchema = new Schema({
  num: {
    type: Number,
    unique: true,
  },
  views: {
    type: Number,
    min: 0,
    default: 0,
  },
});

let View;

module.exports.connect = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(mongoDBConnectionString, {
      useUnifiedTopology: true,
    });

    db.on("error", (err) => {
      reject(err);
    });

    db.once("open", () => {
      View = db.model("views", viewsSchema);
      resolve();
    });
  });
};

module.exports.addViews = function (num) {
  return new Promise(function (resolve, reject) {
    View.findOneAndUpdate(
      { num: num },
      { $inc: { views: 1 } },
      { upsert: true }
    )
      .exec()
      .then((viewInfo) => {
        resolve(viewInfo);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
