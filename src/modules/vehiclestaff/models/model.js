'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VehiclestaffSchema = new Schema({
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
        type: String,
        unique: true
    },
    driverId: {
        type: String
    },    
    persanalId: {
        type: String,
    },   
    isShareHolder: {
        type: Boolean,
        default: 'false'
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

VehiclestaffSchema.pre('save', function(next){
    let Vehiclestaff = this;
    const model = mongoose.model("Vehiclestaff", VehiclestaffSchema);
    if (Vehiclestaff.isNew) {
        // create
        next();
    }else{
        // update
        Vehiclestaff.updated = new Date();
        next();
    }
    
    
})
mongoose.model("Vehiclestaff", VehiclestaffSchema);