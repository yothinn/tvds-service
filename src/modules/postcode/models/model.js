'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PostcodeSchema = new Schema({
    locationcode: {
        type: String,
        default: '',
        required: 'Please fill Postcode locationcode',
        unique: true,
        trim: true
    },
    district: {
        type: String,
        default: '',
        required: 'Please fill Postcode district',
        trim: true
    },
    province: {
        type: String,
        default: '',
        required: 'Please fill Postcode province',
        trim: true
    },
    postcode: {
        type: String,
        default: '',
        required: 'Please fill Postcode postcode',
        trim: true
    },
    subdistrict: {
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
PostcodeSchema.pre('save', function (next) {
    let Postcode = this;
    const model = mongoose.model("Postcode", PostcodeSchema);
    if (Postcode.isNew) {
        // create
        next();
    } else {
        // update
        Postcode.updated = new Date();
        next();
    }


})
mongoose.model("Postcode", PostcodeSchema);