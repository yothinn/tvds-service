"use strict";
// use model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TvdscustomerSchema = new Schema({
  title: {
    type: String,
  },
  firstName: {
    type: String,
    required: "Please fill in your first name",
  },
  lastName: {
    type: String,
    required: "Please fill in your last name",
  },
  displayName: {
    type: String,
    required: "Please fill in your full name",
    unique: "Full name already exists",
  },
  persanalId: {
    type: String,
  },
  isShareHolder: {
    type: Boolean,
    default: "false",
  },
  mobileNo1: {
    type: String,
  },
  mobileNo2: {
    type: String,
  },
  mobileNo3: {
    type: String,
  },
  addressLine1: {
    type: String,
  },
  addressStreet: {
    type: String,
  },
  addressSubDistrict: {
    type: String,
  },
  addressDistrict: {
    type: String,
  },
  addressProvince: {
    type: String,
  },
  addressPostCode: {
    type: String,
  },
  lineUserId: {
    type: String,
  },
  latitude: {
    type: String,
  },
  longitude: {
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
TvdscustomerSchema.pre("save", function (next) {
  let Tvdscustomer = this;
  const model = mongoose.model("Tvdscustomer", TvdscustomerSchema);
  if (Tvdscustomer.isNew) {
    // create
    if (Tvdscustomer.displayName) {
      Tvdscustomer.displayName = `${Tvdscustomer.firstName.trim()} ${Tvdscustomer.lastName.trim()}`;
    }
    if (!Tvdscustomer.createby) {
      Tvdscustomer.createby = {
        _id: Vehiclestaff.lineUserId,
        username: "Line:" + Tvdscustomer.lineUserId,
        displayname: "Line:" + Tvdscustomer.lineUserId,
      };
    }
    next();
  } else {
    // update
    if (Tvdscustomer.displayName) {
      Tvdscustomer.displayName = `${Tvdscustomer.firstName.trim()} ${Tvdscustomer.lastName.trim()}`;
    }
    Tvdscustomer.updated = new Date();
    if (!Tvdscustomer.updateby) {
      Tvdscustomer.updateby = {
        _id: Vehiclestaff.lineUserId,
        username: "Line:" + Tvdscustomer.lineUserId,
        displayname: "Line:" + Tvdscustomer.lineUserId,
      };
    }
    next();
  }
});
mongoose.model("Tvdscustomer", TvdscustomerSchema);
