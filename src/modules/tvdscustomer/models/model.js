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
    trim: true,
    index: true,
    unique: true,
    sparse: true,
  },
  isShareHolder: {
    type: Boolean,
    default: "false",
  },
  activated: {
    type: Boolean,
    default: "true",
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
  lineDisplayName: {
    type: String,
  },
  lineChatId: {
    type: String,
  },  
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  notes: {
    type: String,
  },
  // Fixed in 7 length total, index 0 is sunday, index 6 is saturday
  // Specify convenient days of service
  // if true, it means convenient to receive services
  convenientDay: [{
    type: Boolean,
  }],
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

  // When persanalId is empty string , change to undefined
  // because empty string will duplicate value
  if (Tvdscustomer.persanalId === "") {
    Tvdscustomer.persanalId = undefined;
  }

  if (Tvdscustomer.isNew) {
    // create
    if (Tvdscustomer.displayName) {
      Tvdscustomer.displayName = `${Tvdscustomer.firstName.trim()} ${Tvdscustomer.lastName.trim()}`;
    }
    // if (!Tvdscustomer.createby) {
    //   Tvdscustomer.createby = {
    //     _id: Vehiclestaff.lineUserId,
    //     username: "Line:" + Tvdscustomer.lineUserId,
    //     displayname: "Line:" + Tvdscustomer.lineUserId,
    //   };
    // }
    next();
  } else {
    // update
    if (Tvdscustomer.displayName) {
      Tvdscustomer.displayName = `${Tvdscustomer.firstName.trim()} ${Tvdscustomer.lastName.trim()}`;
    }
    Tvdscustomer.updated = new Date();
    // if (!Tvdscustomer.updateby) {
    //   Tvdscustomer.updateby = {
    //     _id: Vehiclestaff.lineUserId,
    //     username: "Line:" + Tvdscustomer.lineUserId,
    //     displayname: "Line:" + Tvdscustomer.lineUserId,
    //   };
    // }
    next();
  }
});
mongoose.model("Tvdscustomer", TvdscustomerSchema);
