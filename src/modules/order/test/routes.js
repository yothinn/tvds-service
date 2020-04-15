'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Order = mongoose.model('Order'),
    Involvedparty = mongoose.model('Involvedparty');

var credentials,
    token,
    mockup;

describe('Order CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            "docdate": "2020-10-23",
            "carNo": "1",
            "orderStatus": "draft",
            "contactLists": [
                {
                    "contactStatus": "select",
                    "personalInfo": {
                        "title": "mr",
                        "titleThai": "นาย",
                        "firstName": "Dinsoh",
                        "firstNameThai": "ดินสอ",
                        "middleName": "middle",
                        "middleNameThai": "กลาง",
                        "lastName": "Pakka",
                        "lastNameThai": "ปากกา",
                        "citizenId": "1159555569865",
                        "dateOfBirth": "2020-04-08",
                        "gender": "ชาย"
                    },
                    "directContact": [
                        {
                            "method": "เบอร์มือถือ",
                            "value": "0987451255"
                        }
                    ],
                    "contactAddress": {
                        "addressLine1": "บ้านเลขที่ 78/1",
                        "addressStreet": "วงแหวนลำลูกกา",
                        "addressSubDistrict": "บึงคำพร้อย",
                        "addressDistrict": "ลำลูกกา",
                        "addressProvince": "ปทุมธานี",
                        "addressCountry": "ไทย",
                        "addressPostalCode": "12130",
                        "latitude": "13.7480318",
                        "longitude": "100.5848721"
                    },
                    "membership": [
                        {
                            "activity": "shareholder",
                            "memberReference": "1234"
                        },
                        {
                            "activity": "delivery",
                            "memberReference": "1234"
                        }
                    ]
                }
            ]
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Order get use token', (done) => {
        request(app)
            .get('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Order get by id', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/orders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp.data)
                        assert.equal(resp.status, 200);
                        // assert.equal(resp.data.docno, "2020-10-001");
                        // assert.equal(resp.data.docdate, mockup.docdate);
                        assert.equal(resp.data.carNo, mockup.carNo);
                        assert.equal(resp.data.cusAmount, 1);
                        assert.equal(resp.data.orderStatus, mockup.orderStatus);

                        assert.equal(resp.data.contactLists.length, 1);
                        assert.equal(resp.data.contactLists[0].contactStatus, mockup.contactLists[0].contactStatus);
                        assert.equal(resp.data.contactLists[0].membership[0].activity, mockup.contactLists[0].membership[0].activity);
                        assert.equal(resp.data.contactLists[0].membership[0].memberReference, mockup.contactLists[0].membership[0].memberReference);
                        assert.equal(resp.data.contactLists[0].membership[1].activity, mockup.contactLists[0].membership[1].activity);
                        assert.equal(resp.data.contactLists[0].membership[1].memberReference, mockup.contactLists[0].membership[1].memberReference);
                        done();
                    });
            });

    });

    it('should be Order post use token', (done) => {
        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                // assert.equal(resp.data.docno, "2020-10-001");
                // assert.equal(resp.data.docdate, mockup.docdate);
                assert.equal(resp.data.carNo, mockup.carNo);
                assert.equal(resp.data.cusAmount, 1);
                assert.equal(resp.data.orderStatus, mockup.orderStatus);

                assert.equal(resp.data.contactLists.length, 1);
                assert.equal(resp.data.contactLists[0].contactStatus, mockup.contactLists[0].contactStatus);
                done();
            });
    });

    it('should be order put use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    "orderStatus": "golive"
                };
                request(app)
                    .put('/api/orders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // assert.equal(resp.data.docno, "2020-10-001");
                        // assert.equal(resp.data.docdate, mockup.docdate);
                        assert.equal(resp.data.carNo, mockup.carNo);
                        assert.equal(resp.data.cusAmount, 1);
                        assert.equal(resp.data.orderStatus, update.orderStatus);

                        assert.equal(resp.data.contactLists.length, 1);
                        assert.equal(resp.data.contactLists[0].contactStatus, mockup.contactLists[0].contactStatus);
                        done();
                    });
            });

    });

    it('should be order delete use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/orders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be map IPI and order', function (done) {
        var ipi1 = new Involvedparty({
            "involedPartyID": "partyid001",
            "personalInfo": {
                "title": "mr",
                "titleThai": "นาย",
                "firstName": "",
                "firstNameThai": "เบอร์เกอร์",
                "middleName": "",
                "middleNameThai": "",
                "lastName": "",
                "lastNameThai": "ซอสพริก",
                "citizenId": "1159555569865",
                "dateOfBirth": "2020-04-08",
                "gender": "ชาย"
            },
            "directContact": [
                {
                    "method": "เบอร์มือถือ",
                    "value": "0987451255"
                }
            ],
            "contactAddress": {
                "addressLine1": "บ้านเลขที่ 78/1",
                "addressStreet": "วงแหวนลำลูกกา",
                "addressSubDistrict": "บึงคำพร้อย",
                "addressDistrict": "ลำลูกกา",
                "addressProvince": "ปทุมธานี",
                "addressCountry": "ไทย",
                "addressPostalCode": "12130",
                "latitude": "14.023695",
                "longitude": "100.664178"
            },
            "membership": [
                {
                    "activity": "delivery"
                }
            ]
        });
        var ipi2 = new Involvedparty({
            "involedPartyID": "partyid002",
            "personalInfo": {
                "title": "mr",
                "titleThai": "นาย",
                "firstName": "",
                "firstNameThai": "เบอร์เกอร์",
                "middleName": "",
                "middleNameThai": "",
                "lastName": "",
                "lastNameThai": "ซอสพริก",
                "citizenId": "1159555569865",
                "dateOfBirth": "2020-04-08",
                "gender": "ชาย"
            },
            "directContact": [
                {
                    "method": "เบอร์มือถือ",
                    "value": "0987451255"
                }
            ],
            "contactAddress": {
                "addressLine1": "บ้านเลขที่ 78/1",
                "addressStreet": "วงแหวนลำลูกกา",
                "addressSubDistrict": "บึงคำพร้อย",
                "addressDistrict": "ลำลูกกา",
                "addressProvince": "ปทุมธานี",
                "addressCountry": "ไทย",
                "addressPostalCode": "12130",
                "latitude": "14.023695",
                "longitude": "100.664178"
            },
            "membership": [
                {
                    "activity": "delivery"
                },
                {
                    "activity": "shareholder"
                }
            ]
        });
        var ipi3 = new Involvedparty({
            "involedPartyID": "partyid003",
            "personalInfo": {
                "title": "mr",
                "titleThai": "นาย",
                "firstName": "",
                "firstNameThai": "เบอร์เกอร์",
                "middleName": "",
                "middleNameThai": "",
                "lastName": "",
                "lastNameThai": "ซอสพริก",
                "citizenId": "1159555569865",
                "dateOfBirth": "2020-04-08",
                "gender": "ชาย"
            },
            "directContact": [
                {
                    "method": "เบอร์มือถือ",
                    "value": "0987451255"
                }
            ],
            "contactAddress": {
                "addressLine1": "บ้านเลขที่ 78/1",
                "addressStreet": "วงแหวนลำลูกกา",
                "addressSubDistrict": "บึงคำพร้อย",
                "addressDistrict": "ลำลูกกา",
                "addressProvince": "ปทุมธานี",
                "addressCountry": "ไทย",
                "addressPostalCode": "12130",
                "latitude": "14.023695",
                "longitude": "100.664178"
            },
            "membership": [
                {
                    "activity": "driver"
                }
            ]
        });
        var ipi4 = new Involvedparty({
            "involedPartyID": "partyid004",
            "personalInfo": {
                "title": "mr",
                "titleThai": "นาย",
                "firstName": "",
                "firstNameThai": "เบอร์เกอร์",
                "middleName": "",
                "middleNameThai": "",
                "lastName": "",
                "lastNameThai": "ซอสพริก",
                "citizenId": "1159555569865",
                "dateOfBirth": "2020-04-08",
                "gender": "ชาย"
            },
            "directContact": [
                {
                    "method": "เบอร์มือถือ",
                    "value": "0987451255"
                }
            ],
            "contactAddress": {
                "addressLine1": "บ้านเลขที่ 78/1",
                "addressStreet": "วงแหวนลำลูกกา",
                "addressSubDistrict": "บึงคำพร้อย",
                "addressDistrict": "ลำลูกกา",
                "addressProvince": "ปทุมธานี",
                "addressCountry": "ไทย",
                "addressPostalCode": "12130",
                "latitude": "14.023695",
                "longitude": "100.664178"
            },
            "membership": [
                {
                    "activity": "shareholder"
                },
                {
                    "activity": "delivery"
                }
            ]
        });

        var body = {
            "docdate": "2020-10-03"
        };

        ipi1.save(function (err, data1) {
            ipi2.save(function (err, data2) {
                ipi3.save(function (err, data3) {
                    ipi4.save(function (err, data4) {

                        var order1 = new Order({
                            "docno": "2020-10-0001",
                            "docdate": "2020-10-01",
                            "carNo": "01",
                            "orderStatus": "draft",
                            "contactLists": [{
                                _id: data1._id,
                                contactStatus: "select",
                                membership: data1.membership
                            }]
                        });

                        var order2 = new Order({
                            "docno": "2020-10-0002",
                            "docdate": "2020-10-03",
                            "carNo": "03",
                            "orderStatus": "draft",
                            "contactLists": [
                                {
                                    _id: data1._id,
                                    contactStatus: "select",
                                    membership: data1.membership
                                }, {
                                    _id: data2._id,
                                    contactStatus: "confirm",
                                    membership: data2.membership
                                }
                            ]
                        });

                        order1.save(function (err, order1) {
                            if (err) {
                                return done(err);
                            }
                            order2.save(function (err, order2) {
                                if (err) {
                                    return done(err);
                                }
                                request(app)
                                    .post('/api/ordersupdatemap')
                                    .set('Authorization', 'Bearer ' + token)
                                    .send(body)
                                    .expect(200)
                                    .end(function (err, res) {
                                        if (err) {
                                            return done(err);
                                        }
                                        var resp = res.body;
                                        // console.log(resp);
                                        assert.equal(resp.data.length, 3)
                                        assert.equal(resp.data[0].contactStatus, 'select')
                                        assert.equal(resp.data[0].docno, "2020-10-0002")
                                        assert.equal(resp.data[1].contactStatus, 'confirm')
                                        assert.equal(resp.data[1].docno, "2020-10-0002")
                                        assert.equal(resp.data[2].contactStatus, '')
                                        done();
                                    });
                            });
                        });
                    });
                });
            });
        });
    });

    it('should be order get not use token', (done) => {
        request(app)
            .get('/api/orders')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be order post not use token', function (done) {

        request(app)
            .post('/api/orders')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be order put not use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/orders/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be order delete not use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/orders/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Order.deleteMany().exec(done);
    });

});