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
        type: Date
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
    contactLists: {
        type: [
            {
                contactStatus: {
                    type: String,
                    enum: ["select", "waitapprove", "confirm", "reject"]
                },
                personalInfo: {
                    type: {
                        title: {
                            type: String
                        },
                        titleThai: {
                            type: String
                        },
                        firstName: {
                            type: String
                        },
                        firstNameThai: {
                            type: String
                        },
                        middleName: {
                            type: String
                        },
                        middleNameThai: {
                            type: String
                        },
                        lastName: {
                            type: String
                        },
                        lastNameThai: {
                            type: String
                        },
                        citizenId: {
                            type: String
                        },
                        dateOfBirth: {
                            type: Date
                        },
                        gender: {
                            type: String
                        }
                    }
                },
                directContact: {
                    type: [
                        {
                            method: {
                                type: String
                            },
                            value: {
                                type: String
                            }
                        }
                    ]
                },
                contactAddress: {
                    type: {
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
                        addressCountry: {
                            type: String
                        },
                        addressPostalCode: {
                            type: String
                        },
                        latitude: {
                            type: String
                        },
                        longitude: {
                            type: String
                        }
                    }
                },
                membership: {
                    type: String
                },
            }
        ]
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
    Order.cusAmount = Order.contactLists.length;
    const model = mongoose.model("Order", OrderSchema);
    const startOfMonth = moment(Order.docdate).startOf('month').format();
    const endOfMonth = moment(Order.docdate).endOf('month').format();
    if (Order.isNew) {
        // create
        model.find({ docdate: { $gte: startOfMonth, $lte: endOfMonth } }, function (err, data) {
            if (err) next(err);
            var year = new Date(Order.docdate).getFullYear();
            var month = new Date(Order.docdate).getMonth() + 1;
            var fullMonth = month.toString().padStart(2, "0");
            var num = data.length + 1;
            var no = num.toString().padStart(4, "0");
            Order.docno = year.toString() + '-' + fullMonth.toString() + '-' + no.toString();
            next();
        });

        // var newDate = new Date();
        // var textDate = newDate.getFullYear().toString().substr(2, 2) + (newDate.getMonth() + 1).toString().padStart(2, "0") +
        //     newDate.getDate().toString().padStart(2, "0") + newDate.getTime().toString().substr(4, 9);
        // Order.docno = textDate;
        // next();

    } else {
        // update
        Order.updated = new Date();
        next();
    }


})
mongoose.model("Order", OrderSchema);