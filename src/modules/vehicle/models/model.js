'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VehicleSchema = new Schema({
    lisenceID: {
        type: String,
        unique: true,
        required: 'Please fill a Vehicle lisenceID',
    },
    ownerInfo: {
        type: {
            title: {
                type: String,
            },
            titleThai: {
                type: String,
            },
            firstName: {
                type: String,
            },
            firstNameThai: {
                type: String,
            },
            middleName: {
                type: String,
            },
            middleNameThai: {
                type: String,
            },
            lastName: {
                type: String,
            },
            lastNameThai: {
                type: String,
            },
            dateOfBirth: {
                type: Date,
            },
            gender: {
                type: String,
            }
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