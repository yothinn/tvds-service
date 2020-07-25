"use strict";
// use model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var moment = require("moment");

var JoborderSchema = new Schema({
  docno: {
    type: String,
    unique: true,
  },
  docdate: {
    type: Date,
  },
  carNo: {
    type: {
      lisenceID: {
        type: String,
      },
      vehicleType: {
        type: String,
      },
      vehicleColor: {
        type: String,
      },
      vehicleBrand: {
        type: String,
      },
      isOwner: {
        type: Boolean,
        default: true,
      },
      ownerInfo: {
        type: {
          title: {
            type: String,
          },
          firstName: {
            type: String,
          },
          lastName: {
            type: String,
          },
          displayName: {
            type: String,
          },
          isCompany: {
            type: Boolean,
            default: false,
          },
          refId: {
            type: String,
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
        },
      },
      driverInfo: {
        type: {
          title: {
            type: String,
          },
          firstName: {
            type: String,
          },
          lastName: {
            type: String,
          },
          displayName: {
            type: String,
          },
          persanalId: {
            type: String,
          },
          isShareHolder: {
            type: Boolean,
            default: false,
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
        },
      },
    },
  },
  cusAmount: {
    type: Number,
  },
  orderStatus: {
    type: String,
    enum: [
      "draft", 
      "waitapprove", 
      "orderavailable", 
      "serviceprepared", 
      "ordercancel", 
      "golive", 
      "close", 
      "closewithcondition",
    ],
  },
  contactLists: {
    type: [
      {
        contactStatus: {
          type: String,
          enum: [
            "select",
            "waitapprove",
            "waitcontact",
            "confirm",
            "reject",
            "arrival",
            "departure",
            "driver-reject",
          ],
        },
        remark: {
          type: String,
        },
        title: {
          type: String,
        },
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
        },
        displayName: {
          type: String,
        },
        persanalId: {
          type: String,
        },
        isShareHolder: {
          type: Boolean,
          default: false,
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
        sales: {
          type: Number,
        },
      },
    ],
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
JoborderSchema.pre("save", function (next) {
  let Joborder = this;
  Joborder.cusAmount = Joborder.contactLists.length;
  const model = mongoose.model("Joborder", JoborderSchema);
  const startOfMonth = moment(Joborder.docdate).startOf("month").format();
  const endOfMonth = moment(Joborder.docdate).endOf("month").format();
  if (Joborder.isNew) {
    // create
    model.find({ docdate: { $gte: startOfMonth, $lte: endOfMonth } }, function (
      err,
      data
    ) {
      if (err) next(err);
      var year = new Date(Joborder.docdate).getFullYear();
      var month = new Date(Joborder.docdate).getMonth() + 1;
      var fullMonth = month.toString().padStart(2, "0");

      if (data.length === 0) {
        var num = 1;
        var no = num.toString().padStart(4, "0");
      } else {
        var docnoLastest = data[data.length - 1].docno.substr(8, 4);
        var num = Number(docnoLastest) + 1;
        var no = num.toString().padStart(4, "0");
      }

      Joborder.docno =
        year.toString() + "-" + fullMonth.toString() + "-" + no.toString();
      next();
    });
  } else {
    // update
    Joborder.updated = new Date();
    next();
  }
});
mongoose.model("Joborder", JoborderSchema);
