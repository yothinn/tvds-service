'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VehicleSchema = new Schema({
    lisenceID: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    vehicleType: {
        type: String
    },
    vehicleColor: {
        type: String
    },
    vehicleBrand: {
        type: String
    },
    isOwner: {
        type: Boolean,
        default: true
    },
    ownerInfo: {
        type: {
            title: {
                type: String
            },
            firstName: {
                type: String
            },
            lastName: {
                type: String
            },
            displayName: {
                type: String
            },
            isCompany: {
                type: Boolean,
                default: false
            },
            refId: {
                type: String
            },
            mobileNo1: {
                type: String
            },
            mobileNo2: {
                type: String
            },
            mobileNo3: {
                type: String
            },
            addressLine1: {
                type: String
            },
            addressStreet: {
                type: String
            },
            addressSubDistrict: {
                type: String
            },
            addressDistrict: {
                type: String
            },
            addressProvince: {
                type: String
            },
            addressPostCode: {
                type: String
            },
            lineUserId: {
                type: String
            },
            latitude: {
                type: String
            },
            longitude: {
                type: String
            },
        }
    },
    driverInfo: {
        type: {
            title: {
                type: String
            },
            firstName: {
                type: String
            },
            lastName: {
                type: String
            },
            displayName: {
                type: String
            },
            persanalId: {
                type: String
            },
            isShareHolder: {
                type: Boolean,
                default: false
            },
            mobileNo1: {
                type: String
            },
            mobileNo2: {
                type: String
            },
            mobileNo3: {
                type: String
            },
            addressLine1: {
                type: String
            },
            addressStreet: {
                type: String
            },
            addressSubDistrict: {
                type: String
            },
            addressDistrict: {
                type: String
            },
            addressProvince: {
                type: String
            },
            addressPostCode: {
                type: String
            },
            lineUserId: {
                type: String
            },
            latitude: {
                type: String
            },
            longitude: {
                type: String
            },
        }
    },
    vehicleInfo:{

    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});
VehicleSchema.pre('save', function (next) {
    let Vehicle = this;
    const model = mongoose.model("Vehicle", VehicleSchema);
    if (Vehicle.isNew) {
        // create
        next();
    } else {
        // update
        Vehicle.updated = new Date();
        next();
    }


})
mongoose.model("Vehicle", VehicleSchema);