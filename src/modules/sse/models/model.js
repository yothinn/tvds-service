'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SseSchema = new Schema({
    name: {
        type: String,
        required: 'Please fill a Sse name',
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
SseSchema.pre('save', function(next){
    let Sse = this;
    const model = mongoose.model("Sse", SseSchema);
    if (Sse.isNew) {
        // create
        next();
    }else{
        // update
        Sse.updated = new Date();
        next();
    }
    
    
})
mongoose.model("Sse", SseSchema);