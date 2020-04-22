'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TvdscustomerSchema = new Schema({
    title: {
        type: String,
    },
    firstName: {
        type: String,
        required: 'Please fill a firstnamee',
    },
    lastName: {
        type: String,
        required: 'Please fill a lastname',
    },
    displayName: {
        type: String,
        unique: true,
    },    
    persanalId: {
        type: String,
        unique: true,
    },   
    isShareHolder: {
        type: Boolean,
        default: 'false'
    },
    mobileNo1: {
        type: String,
        required: 'Please fill a mobileNo1',
    },
    mobileNo2: {
        type: String,
    },
    mobileNo3: {
        type: String,
    },
    addressLine1: {
        type: String,
        required: 'Please fill a addressLine1',
    },
    addressStreet: {
        type: String,
        required: 'Please fill a addressStreet',
    },
    addressSubdistric: {
        type: String,
        required: 'Please fill a addressSubdistric',
    },
    addressDistric: {
        type: String,
        required: 'Please fill a addressDistric',
    },
    addressProvince: {
        type: String,
        required: 'Please fill a addressProvince',
    },
    addressPostcode: {
        type: String,
        required: 'Please fill a addressPostcode',
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
TvdscustomerSchema.pre('save', function(next){
    let Tvdscustomer = this;
    const model = mongoose.model("Tvdscustomer", TvdscustomerSchema);
    if (Tvdscustomer.isNew) {
        // create
        next();
    }else{
        // update
        Tvdscustomer.updated = new Date();
        next();
    }
    
    
})
mongoose.model("Tvdscustomer", TvdscustomerSchema);