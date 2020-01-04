const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pollSchema = Schema({
  PollID: Number,
  CreatedBy: Number,
  CreatedDate: Date,
  Question: String,
  Answeroptions: [String],
  Results: [Number],
  PublishStatus: Boolean,
  ArchiveStatus: Boolean,
  TotalResponses: Number,
  ResetDate: Date,
  RestrictAccess: Boolean
});

const RdrPoll = mongoose.model("RdrPoll", pollSchema);

module.exports = RdrPoll;
