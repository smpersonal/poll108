// DEPENDENCIES

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const RdrPoll = require("../models/poll.js");
const bodyParser = require("body-parser");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
router.use(express.static("public"));
// router.use(express.static(__dirname + "/public")); // static files middleware

//
//
// ROUTES
// get root
router.get("/", (req, res) => {
  console.log("IN /poll /");
  res.render("poll/index.ejs");
});
//
// get poll
router.get("/poll", (req, res) => {
  console.log("IN /poll /poll");

  res.render("poll/index.ejs");
});
//
// get index
router.get("/index", (req, res) => {
  // console.log(RdrPoll.find());

  console.log("IN /poll /index");

  RdrPoll.find({}, (error, allPolls) => {
    if (error) {
      res.send(error);
    } else {
      // res.send(allBooks);
      res.render("poll/index.ejs", {
        polls: allPolls
      });
    }
  });
  // res.send("router is running");
});

// /poll/:id	GET	show
router.get("/show/:id", (req, res) => {
  console.log("IN GET POLL BY ID ", req.headers);
  // console.log(RdrPoll.findById(req.params.id));
  // console.log(RdrPoll.find());
  // res.redirect("/poll");
  RdrPoll.findById(req.params.id, (err, poll) => {
    if (err) {
      res.send(err);
    } else {
      console.log("RdrPoll.find() success", poll);
      // res.setHeader("Content-Type", "text/css"); ///
      res.render("poll/show.ejs", {
        poll: poll
      });
      console.log("AFTER RENDER");
    }
  });
});

// /poll/:id	PATCH/PUT	update
router.put("/:id", (req, res) => {
  //
  console.log("IN PUT POLL BY ID ", req.headers);
  //
  let pollEntry = Object.values(req.body);
  console.log(Object.values(req.body));
  let newResults = [];
  //
  RdrPoll.findById(req.params.id, (err, poll) => {
    for (let i = 0; i < poll.Answeroptions.length; i++) {
      newResults[i] =
        (pollEntry[0] === poll.Answeroptions[i] ? 1 : 0) +
        (poll.Results[i] === undefined ? 0 : poll.Results[i]);
    }
    //
    RdrPoll.findByIdAndUpdate(
      req.params.id,
      { $pull: { Results: { $gte: 0 } } }, // Delete the existing values
      { new: true },
      (err, updatedpoll) => {
        if (err) {
          console.log(err);
        } else {
          // console.log("else find update - level1  ");
          // console.log("updatedpoll: ", updatedpoll.Results);

          RdrPoll.findByIdAndUpdate(
            req.params.id,
            { $set: { Results: newResults } }, // Set to new set of values
            { new: true },
            (err, updatedpoll2) => {
              if (err) {
                console.log(err);
              } else {
                // console.log("else find update - level2  ");
                console.log("updatedpoll: ", updatedpoll2);
                res.render("poll/show.ejs", {
                  poll: updatedpoll2
                });
              }
            }
          );
        }
      }
    );
  });
});

///
///

router.get("/new", (req, res) => {
  console.log("IN /poll /");
  res.render("poll/new.ejs");
});

//...farther down the page
router.post("/new", (req, res) => {
  console.log(req.body);

  req.body.Answeroptions = req.body.Answeroptions.split(",");
  req.body.Results = [];

  RdrPoll.create(req.body, (err, createdpoll) => {
    // console.log("In polls create");
    // console.log(RdrPoll.find()); // Issue was type conversion earlier//

    if (err) {
      res.send(err);
    } else {
      console.log("write success");
      // res.redirect("/poll/new");
      res.render("poll/new.ejs");
    }
  });
});

module.exports = router;
