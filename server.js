var express = require("express");
var app = express();
var hbs = require("express-handlebars");
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;

var loadComicInfo = require("./public/js/loadComicInfo");
var formatData = require("./public/js/formatData");

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

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
      randomComic: function () {
        return `/comic/${Math.floor(Math.random() * (2488 - 1) + 1)}`;
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
      response.transcript = formatData.parseTranscript(response.transcript);
      res.render("home", {
        data: response,
        displayTranscript: displayTranscript,
      });
    })
    .catch((error) => {
      res.render("home", { err: true });
    });
});

app.get("/comic/:id", (req, res) => {
  loadComicInfo
    .getComicById(req.params.id)
    .then((response) => {
      response.date = formatData.formatDate(response);
      const displayTranscript = response.transcript.length === 0 ? false : true;
      response.transcript = formatData.parseTranscript(response.transcript);
      res.render("home", {
        data: response,
        displayTranscript: displayTranscript,
      });
    })
    .catch((error) => {
      res.render("home", { err: true });
    });
});

app.post("/find", (req, res) => {
  res.redirect(`/comic/${req.body.find}`);
});

app.get(/.*/, function (req, res) {
  res.render("home", { err: true });
});

app.listen(HTTP_PORT, onHttpStart);
