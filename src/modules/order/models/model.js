'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');


var OrderSchema = new Schema({
    docno: {
        type: String,
        unique: true,
    },
    docdate: {
        type: Date,
        required: 'Please fill a Order document date',
    },
    carNo: {
        type: String
    },
    cusAmount: {
        type: Number
    },
    orderStatus: {
        type: String,
        enum: ['draft', 'golive', 'close']
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
OrderSchema.pre('save', function (next) {
    let Order = this;
    const model = mongoose.model("Order", OrderSchema);
    const startOfMonth = moment(Order.docdate).startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment(Order.docdate).endOf('month').format('YYYY-MM-DD');
    if (Order.isNew) {
        // create
        model.find({ docdate: { $gte: startOfMonth, $lte: endOfMonth } }, function (err, data) {
            if (err) next(err);
            var year = new Date(Order.docdate).getFullYear();
            var month = new Date(Order.docdate).getMonth() + 1;
            var fullMonth = month.toString().padStart(2, "0");
            var num = data.length + 1;
            var no = num.toString().padStart(3, "0");
            Order.docno = year.toString() + '-' + fullMonth.toString() + '-' + no.toString();
            next();
        })

    } else {
        // update
        Order.updated = new Date();
        next();
    }


})
mongoose.model("Order", OrderSchema);