var express = require("express");
var app = express();
var hbs = require("express-handlebars");
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;

var loadComicInfo = require("./public/js/loadComicInfo");
var formatData = require("./public/js/formatData");
var viewsCounter = require("./public/js/viewsCounter");

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: null,
    partialsDir: "views/partials",
    helpers: {
      nextComic: function (value) {
        return `/comic/${parseInt(value) + 1}`;
      },
      prevComic: function (value) {
        return `/comic/${parseInt(value) - 1}`;
      },
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", "./views");
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.redirect("/comic");
});

app.get("/comic", (req, res) => {
  loadComicInfo
    .currentComic()
    .then((response) => {
      response.date = formatData.formatDate(response);
      const displayTranscript = response.transcript.length === 0 ? false : true;
      const disabledPrev = response.num == 1 ? false : true;
      const disabledNext = false;
      const randomId = `/comic/${Math.floor(
        Math.random() * (response.num - 1) + 1
      )}`;
      response.transcript = formatData.parseTranscript(response.transcript);
      viewsCounter
        .addViews(response.num)
        .then((viewsData) => {
          res.render("home", {
            data: response,
            displayTranscript: displayTranscript,
            disabledPrev: disabledPrev,
            disabledNext: disabledNext,
            randomId: randomId,
            views: viewsData === null ? 0 : viewsData.views,
          });
        })
        .catch((error) => {
          res.render("home", { err: true });
        });
    })
    .catch((error) => {
      loadComicInfo
        .currentComicNum()
        .then((currentComicNum) => {
          const randomId = `/comic/${Math.floor(
            Math.random() * (currentComicNum - 1) + 1
          )}`;
          res.render("home", {
            err: true,
            randomId: randomId,
          });
        })
        .catch((error) => {
          res.render("home", { err: true });
        });
    });
});

app.get("/comic/:id", (req, res) => {
  loadComicInfo
    .getComicById(req.params.id)
    .then((response) => {
      response.date = formatData.formatDate(response);
      loadComicInfo
        .currentComicNum()
        .then((currentComicNum) => {
          const displayTranscript =
            response.transcript.length === 0 ? false : true;
          const disabledPrev = response.num == 1 ? false : true;
          const disabledNext = response.num == currentComicNum ? false : true;
          const randomId = `/comic/${Math.floor(
            Math.random() * (currentComicNum - 1) + 1
          )}`;
          response.transcript = formatData.parseTranscript(response.transcript);
          viewsCounter
            .addViews(response.num)
            .then((viewsData) => {
              res.render("home", {
                data: response,
                displayTranscript: displayTranscript,
                disabledPrev: disabledPrev,
                disabledNext: disabledNext,
                randomId: randomId,
                views: viewsData === null ? 0 : viewsData.views,
              });
            })
            .catch((error) => {
              res.render("home", { err: true });
            });
        })
        .catch((error) => {
          res.render("home", { err: true });
        });
    })
    .catch((error) => {
      loadComicInfo
        .currentComicNum()
        .then((currentComicNum) => {
          const randomId = `/comic/${Math.floor(
            Math.random() * (currentComicNum - 1) + 1
          )}`;

          res.render("home", {
            err: true,
            randomId: randomId,
          });
        })
        .catch((error) => {
          res.render("home", { err: true });
        });
    });
});

app.post("/find", (req, res) => {
  res.redirect(`/comic/${req.body.find}`);
});

app.get(/.*/, function (req, res) {
  loadComicInfo
    .currentComicNum()
    .then((currentComicNum) => {
      const randomId = `/comic/${Math.floor(
        Math.random() * (currentComicNum - 1) + 1
      )}`;
      res.render("home", {
        err: true,
        randomId: randomId,
      });
    })
    .catch((error) => {
      res.render("home", { err: true });
    });
});

viewsCounter
  .connect()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
  });
