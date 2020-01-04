const express = require("express");
const sessionsRouter = express.Router();
const bcrypt = require("bcrypt");
// sessionsRouter.use(express.static(__dirname + "/public")); // static files middleware
sessionsRouter.use(express.static("public"));
const User = require("../models/user.js");

// const session = require("express-session");
sessionsRouter.get("/new", (req, res) => {
  res.render("sessions/new.ejs");
});

sessionsRouter.get("/failed", (req, res) => {
  res.render("sessions/failedlogin.ejs");
});

//...farther down the page
sessionsRouter.post("/", (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    console.log("in /sessions post");
    if (foundUser) {
      console.log("in user found");
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        console.log("in password matched");
        req.session.currentUser = foundUser;
        res.redirect("/");
      } else {
        console.log("password wrong");
        res.redirect("/sessions/failed");
        // res.send('<a href="/">Wrong password or user go back</a>');
      }
    } else {
      console.log("no user found");
      res.redirect("/sessions/failed");
      // res.redirect("/");
      // res.send('<a href="/">Wrong user or password go back</a>');
    }
  });
});

sessionsRouter.delete("/", (req, res) => {
  console.log(req.session);
  req.session.destroy(() => {
    console.log("session deleted");
    res.redirect("/");
  });
});

module.exports = sessionsRouter;
