// DEPENDENCIES

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const RdrPoll = require("../models/poll.js");
// import { sqrt } from "mathjs/number";

// URL	HTTP Verb	Action
// /poll/	GET	index
// /poll/:id	GET	show
// /poll/new	GET	new
// /poll	POST	create
// /poll/:id/edit	GET	edit
// /poll/:id	PATCH/PUT	update
// /poll/:id	DELETE	destroy

// ROUTES
// get index
router.get("/", (req, res) => {
  console.log("IN /poll /");

  res.render("poll/index.ejs");
});
// get index
router.get("/poll", (req, res) => {
  console.log("IN /poll /poll");

  res.render("poll/index.ejs");
});
/////
router.get("/index", (req, res) => {
  // console.log(RdrPoll.find());

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
  console.log("IN GET POLL BY ID ");
  // console.log(RdrPoll.findById(req.params.id));
  // console.log(RdrPoll.find());
  // res.redirect("/poll");
  RdrPoll.findById(req.params.id, (err, poll) => {
    res.render("poll/show.ejs", {
      poll: poll
    });
  });
});

// /poll/:id	PATCH/PUT	update
router.put("/:id", (req, res) => {
  console.log("IN PUT POLL BY ID ");
  console.log(req.body);
  console.log(Object.keys(req.body));
  let pollEntry = Object.values(req.body);
  console.log(pollEntry);
  // var newArrayDataOfOjbect = Object.values(data);
  let newResults = [];
  RdrPoll.findById(req.params.id, (err, poll) => {
    for (let i = 0; i < Object.keys(req.body).length; i++) {
      console.log(
        i,
        " : pollEntry ",
        pollEntry[i],
        " pollResults: ",
        poll.Results[i]
      );
      newResults[i] =
        (pollEntry[i] === "on" ? 1 : 0) +
        (poll.Results[i] === undefined ? 0 : poll.Results[i]);
    }
    console.log("poll results --- after find", poll.Results);
    // console.log("poll answer options --- after find", poll.Answeroptions);
    console.log("poll results --- after addition", newResults);

    console.log("newResults  ", newResults);
    // poll.Results[i] === undefined;
    let rmlabel = "Results";
    //
    RdrPoll.findByIdAndUpdate(
      req.params.id,
      { $unset: { rmlabel } },
      { new: true },
      (err, updatedpoll) => {
        if (err) {
          console.log(err);
        } else {
          console.log("else find update - level1  ");
          console.log("updatedpoll: ", updatedpoll);

          RdrPoll.findByIdAndUpdate(
            req.params.id,
            { $set: { Results: newResults } },
            { new: true },
            (err, updatedpoll2) => {
              if (err) {
                console.log(err);
              } else {
                console.log("else find update - level2  ");
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
  //
  if (req.body.PublishStatus === "on") {
    req.body.PublishStatus = true;
  } else {
    req.body.PublishStatus = false;
  }
  if (req.body.RestrictAccess === "on") {
    req.body.RestrictAccess = true;
  } else {
    req.body.PublishStatus = false;
  }

  let tmpAns = [];
  let tmpRes = [];
  let tmpStr = "";

  for (let i = 0; i < 5; i++) {
    // console.log(req.body[`Answeroptions${i}`]);
    tmpStr = req.body[`Answeroptions${i}`];
    // console.log(`${tmpStr}`);
    tmpAns.push(`${tmpStr}`);
    tmpRes.push(0);
  }
  // console.log("answers  :", tmpAns);
  // console.log("results  :", tmpRes);
  req.body.Answeroptions = tmpAns;
  req.body.Results = tmpRes;
  // console.log("UPDATED ", req.body);
  //
  RdrPoll.create(req.body, (err, createdpoll) => {
    // console.log("In polls create");
    // console.log(RdrPoll.find()); // Issue was type conversion earlier//
    if (err) {
      res.send(err);
    } else {
      res.redirect("/poll/new");
    }
  });
});

module.exports = router;
