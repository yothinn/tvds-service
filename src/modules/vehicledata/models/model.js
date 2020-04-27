'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VehicledataSchema = new Schema({
    lisenceID: {
        type: String,
        unique: true
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
        default: 'true'
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
                default: 'false'
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
VehicledataSchema.pre('save', function(next){
    let Vehicledata = this;
    const model = mongoose.model("Vehicledata", VehicledataSchema);
    if (Vehicledata.isNew) {
        // create
        next();
    }else{
        // update
        Vehicledata.updated = new Date();
        next();
    }
    
    
})
mongoose.model("Vehicledata", VehicledataSchema);