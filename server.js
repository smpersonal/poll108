// DEPENDENCIES - EXPRESS
const express = require("express");
const app = express();
// MIDDLEWARE
// body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static(__dirname + "/public")); // static files middleware
app.use(express.static("public"));
//PORT
const port = (process.env.PORT || 3000);
// CONNECTIONS
app.listen(port, () => {
  console.log("....... listening on port: ", port);
});
// require("dotenv").config();

//Mongoose
// const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/pollappdb", {
//   useNewUrlParser: true
// });

const mongoose = require("mongoose");
console.log("..... MONGODB_URI ", process.env.MONGODB_URI);
const dbURI = (process.env.MONGODB_URI || "mongodb://localhost:27017/pollappdb");
console.log("..... dbURI ", dbURI);

mongoose.connect(dbURI, {
  useNewUrlParser: true
});


mongoose.set("useFindAndModify", false);
mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});

//Express-session
const session = require("express-session");
app.use(
  session({
    secret: "feedmeseymour", //some random string
    resave: false,
    saveUninitialized: false
  })
);

//method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

// bcrypt
const bcrypt = require("bcrypt");

// CONTROLLERS
// users
const userController = require("./controllers/user.js");
app.use("/user", userController);
const pollController = require("./controllers/poll.js");
app.use("/poll", pollController);
const sessionsController = require("./controllers/sessions.js");
app.use("/sessions", sessionsController);

//

//ROUTES
// GET INDEX
app.get("/", (req, res) => {
  console.log("In server.js get / 1234", req.session.currentUser);
  //   res.render("index.ejs", { User });
  // res.render("index.ejs");

  res.render("index.ejs", {
    currentUser: req.session.currentUser
  });
});

app.get("/index", (req, res) => {
  console.log("In server.js get /index ");
  res.redirect("/");
});

// app.get("/poll/edit", (req, res) => {
//   res.render("poll/edit.ejs");
// });

app.get("/poll/edit", (req, res) => {
  if (req.session.currentUser) {
    res.render("poll/edit.ejs", {
      currentUser: req.session.currentUser
    });
  } else {
    res.redirect("/sessions/new");
  }
});

app.get("/*", (req, res) => {
  res.redirect("/");
});
