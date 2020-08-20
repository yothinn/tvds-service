'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ReportSchema = new Schema({
    name: {
        type: String,
        required: 'Please fill a Report name',
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
ReportSchema.pre('save', function(next){
    let Report = this;
    const model = mongoose.model("Report", ReportSchema);
    if (Report.isNew) {
        // create
        next();
    }else{
        // update
        Report.updated = new Date();
        next();
    }
    
    
})
mongoose.model("Report", ReportSchema);