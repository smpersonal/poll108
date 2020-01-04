// DEPENDENCIES

const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
// userRouter.use(express.static(__dirname + "/public")); // static files middleware
userRouter.use(express.static("public"));

// URL	HTTP Verb	Action
// /user/	GET	index
// /user/:id	GET	show
// /user/new	GET	new
// /user	POST	create
// /user/:id/edit	GET	edit
// /user/:id	PATCH/PUT	update
// /user/:id	DELETE	destroy

// ROUTES
// get index
userRouter.get("/new", (req, res) => {
  console.log("IN /user /new");
  res.render("user/new.ejs");
});

//...farther down the page
userRouter.post("/", (req, res) => {
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  User.create(req.body, (err, createdUser) => {
    console.log("created user ", createdUser);
    res.redirect("/user");
  });
});

module.exports = userRouter;
