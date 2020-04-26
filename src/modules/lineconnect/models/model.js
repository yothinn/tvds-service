"use strict";
// use model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LineconnectSchema = new Schema({
  replyToken: {
    type: String,
  },
  userId: {
    type: String,
  },
  timestamp: {
    type: Number,
  },
  message: {
    type: String,
  },
  destination: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
  },
  createby: {
    _id: {
      type: String,
    },
    username: {
      type: String,
    },
    displayname: {
      type: String,
    },
  },
  updateby: {
    _id: {
      type: String,
    },
    username: {
      type: String,
    },
    displayname: {
      type: String,
    },
  },
});
LineconnectSchema.pre("save", function (next) {
  let Lineconnect = this;
  const model = mongoose.model("Lineconnect", LineconnectSchema);
  if (Lineconnect.isNew) {
    // create
    next();
  } else {
    // update
    Lineconnect.updated = new Date();
    next();
  }
});
mongoose.model("Lineconnect", LineconnectSchema);
