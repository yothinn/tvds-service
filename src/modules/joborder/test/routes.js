'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Joborder = mongoose.model('Joborder'),
    Tvdscustomer = mongoose.model('Tvdscustomer');

var credentials,
    token,
    mockup;

describe('Joborder CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            "docdate": "2020-10-23",
            "carNo": "1",
            "orderStatus": "draft",
            "contactLists": [
                {
                    "contactStatus": "select",
                    "title": "นาย",
                    "firstName": "ไข่ดิบ",
                    "lastName": "ไม่แพงแล้ว",
                    "displayName": "ไข่ดิบ ไม่แพงแล้ว",
                    "persanalId": "1159569636985",
                    "isShareHolder": true,
                    "mobileNo1": "0856953265",
                    "mobileNo2": "",
                    "mobileNo3": "",
                    "addressLine1": "82/668",
                    "addressStreet": "ลำลูกกา",
                    "addressSubDistrict": "คูคต",
                    "addressDistrict": "ลำลูกกา",
                    "addressProvince": "ปทุมธานี",
                    "addressPostCode": "12130",
                    "lineUserId": "L48K25369dbY89",
                    "latitude": "13.22202",
                    "longitude": "16.555697"
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

    it('should be Joborder get use token', (done) => {
        request(app)
            .get('/api/joborders')
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

    it('should be Joborder get by id', function (done) {

        request(app)
            .post('/api/joborders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/joborders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.docno, "2020-10-0001");
                        // assert.equal(resp.data.docdate, mockup.docdate);
                        assert.equal(resp.data.carNo, mockup.carNo);
                        assert.equal(resp.data.cusAmount, 1);
                        assert.equal(resp.data.orderStatus, mockup.orderStatus);
                        assert.equal(resp.data.contactLists.length, 1);
                        assert.equal(resp.data.contactLists[0].title, mockup.contactLists[0].title);
                        assert.equal(resp.data.contactLists[0].firstName, mockup.contactLists[0].firstName);
                        assert.equal(resp.data.contactLists[0].lastName, mockup.contactLists[0].lastName);
                        assert.equal(resp.data.contactLists[0].displayName, mockup.contactLists[0].displayName);
                        assert.equal(resp.data.contactLists[0].persanalId, mockup.contactLists[0].persanalId);
                        assert.equal(resp.data.contactLists[0].isShareHolder, mockup.contactLists[0].isShareHolder);
                        assert.equal(resp.data.contactLists[0].mobileNo1, mockup.contactLists[0].mobileNo1);
                        assert.equal(resp.data.contactLists[0].mobileNo2, mockup.contactLists[0].mobileNo2);
                        assert.equal(resp.data.contactLists[0].mobileNo3, mockup.contactLists[0].mobileNo3);
                        assert.equal(resp.data.contactLists[0].addressLine1, mockup.contactLists[0].addressLine1);
                        assert.equal(resp.data.contactLists[0].addressStreet, mockup.contactLists[0].addressStreet);
                        assert.equal(resp.data.contactLists[0].addressSubDistrict, mockup.contactLists[0].addressSubDistrict);
                        assert.equal(resp.data.contactLists[0].addressDistrict, mockup.contactLists[0].addressDistrict);
                        assert.equal(resp.data.contactLists[0].addressProvince, mockup.contactLists[0].addressProvince);
                        assert.equal(resp.data.contactLists[0].addressPostCode, mockup.contactLists[0].addressPostCode);
                        assert.equal(resp.data.contactLists[0].lineUserId, mockup.contactLists[0].lineUserId);
                        assert.equal(resp.data.contactLists[0].latitude, mockup.contactLists[0].latitude);
                        assert.equal(resp.data.contactLists[0].longitude, mockup.contactLists[0].longitude);
                        done();
                    });
            });

    });

    it('should be Joborder post use token', (done) => {
        request(app)
            .post('/api/joborders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.docno, "2020-10-0001");
                // assert.equal(resp.data.docdate, mockup.docdate);
                assert.equal(resp.data.carNo, mockup.carNo);
                assert.equal(resp.data.cusAmount, 1);
                assert.equal(resp.data.orderStatus, mockup.orderStatus);
                assert.equal(resp.data.contactLists.length, 1);
                assert.equal(resp.data.contactLists[0].title, mockup.contactLists[0].title);
                assert.equal(resp.data.contactLists[0].firstName, mockup.contactLists[0].firstName);
                assert.equal(resp.data.contactLists[0].lastName, mockup.contactLists[0].lastName);
                assert.equal(resp.data.contactLists[0].displayName, mockup.contactLists[0].displayName);
                assert.equal(resp.data.contactLists[0].persanalId, mockup.contactLists[0].persanalId);
                assert.equal(resp.data.contactLists[0].isShareHolder, mockup.contactLists[0].isShareHolder);
                assert.equal(resp.data.contactLists[0].mobileNo1, mockup.contactLists[0].mobileNo1);
                assert.equal(resp.data.contactLists[0].mobileNo2, mockup.contactLists[0].mobileNo2);
                assert.equal(resp.data.contactLists[0].mobileNo3, mockup.contactLists[0].mobileNo3);
                assert.equal(resp.data.contactLists[0].addressLine1, mockup.contactLists[0].addressLine1);
                assert.equal(resp.data.contactLists[0].addressStreet, mockup.contactLists[0].addressStreet);
                assert.equal(resp.data.contactLists[0].addressSubDistrict, mockup.contactLists[0].addressSubDistrict);
                assert.equal(resp.data.contactLists[0].addressDistrict, mockup.contactLists[0].addressDistrict);
                assert.equal(resp.data.contactLists[0].addressProvince, mockup.contactLists[0].addressProvince);
                assert.equal(resp.data.contactLists[0].addressPostCode, mockup.contactLists[0].addressPostCode);
                assert.equal(resp.data.contactLists[0].lineUserId, mockup.contactLists[0].lineUserId);
                assert.equal(resp.data.contactLists[0].latitude, mockup.contactLists[0].latitude);
                assert.equal(resp.data.contactLists[0].longitude, mockup.contactLists[0].longitude);
                done();
            });
    });

    it('should be joborder put use token', function (done) {

        request(app)
            .post('/api/joborders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    carNo: "3"
                }
                request(app)
                    .put('/api/joborders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.docno, "2020-10-0001");
                        // assert.equal(resp.data.docdate, mockup.docdate);
                        assert.equal(resp.data.carNo, update.carNo);
                        assert.equal(resp.data.cusAmount, 1);
                        assert.equal(resp.data.orderStatus, mockup.orderStatus);
                        assert.equal(resp.data.contactLists.length, 1);
                        assert.equal(resp.data.contactLists[0].title, mockup.contactLists[0].title);
                        assert.equal(resp.data.contactLists[0].firstName, mockup.contactLists[0].firstName);
                        assert.equal(resp.data.contactLists[0].lastName, mockup.contactLists[0].lastName);
                        assert.equal(resp.data.contactLists[0].displayName, mockup.contactLists[0].displayName);
                        assert.equal(resp.data.contactLists[0].persanalId, mockup.contactLists[0].persanalId);
                        assert.equal(resp.data.contactLists[0].isShareHolder, mockup.contactLists[0].isShareHolder);
                        assert.equal(resp.data.contactLists[0].mobileNo1, mockup.contactLists[0].mobileNo1);
                        assert.equal(resp.data.contactLists[0].mobileNo2, mockup.contactLists[0].mobileNo2);
                        assert.equal(resp.data.contactLists[0].mobileNo3, mockup.contactLists[0].mobileNo3);
                        assert.equal(resp.data.contactLists[0].addressLine1, mockup.contactLists[0].addressLine1);
                        assert.equal(resp.data.contactLists[0].addressStreet, mockup.contactLists[0].addressStreet);
                        assert.equal(resp.data.contactLists[0].addressSubDistrict, mockup.contactLists[0].addressSubDistrict);
                        assert.equal(resp.data.contactLists[0].addressDistrict, mockup.contactLists[0].addressDistrict);
                        assert.equal(resp.data.contactLists[0].addressProvince, mockup.contactLists[0].addressProvince);
                        assert.equal(resp.data.contactLists[0].addressPostCode, mockup.contactLists[0].addressPostCode);
                        assert.equal(resp.data.contactLists[0].lineUserId, mockup.contactLists[0].lineUserId);
                        assert.equal(resp.data.contactLists[0].latitude, mockup.contactLists[0].latitude);
                        assert.equal(resp.data.contactLists[0].longitude, mockup.contactLists[0].longitude);
                        done();
                    });
            });

    });

    it('should be joborder delete use token', function (done) {

        request(app)
            .post('/api/joborders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/joborders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be map customer and JobOrder', function (done) {
        var cus1 = new Tvdscustomer({
            title: 'นาย',
            firstName: 'ประหยัด',
            lastName: 'จันทร์อังคาร',
            displayName: 'ประหยัด จันทร์อังคาร',
            persanalId: '1180233302547',
            isShareHolder: true,
            mobileNo1: '0965874123',
            mobileNo2: '0567896521',
            mobileNo3: '0874563219',
            addressLine1: '26/1',
            addressStreet: 'วงแหวนลำลูกกา',
            addressSubdistric: 'คูคต',
            addressDistric: 'ลำลูกกา',
            addressProvince: 'ปทุมธานี',
            addressPostcode: '12130',
            lineUserId: 'lineuserid',
            latitude: '15.50236541',
            longitude: '100.45678968'
        });
        var cus2 = new Tvdscustomer({
            title: 'นาย',
            firstName: 'ฟุ่มเฟือย',
            lastName: 'พุธพฤหัส',
            displayName: 'ฟุ่มเฟือย พุธพฤหัส',
            persanalId: '1180233502547',
            isShareHolder: true,
            mobileNo1: '0965874123',
            mobileNo2: '0567896521',
            mobileNo3: '0874563219',
            addressLine1: '26/1',
            addressStreet: 'วงแหวนลำลูกกา',
            addressSubdistric: 'คูคต',
            addressDistric: 'ลำลูกกา',
            addressProvince: 'ปทุมธานี',
            addressPostcode: '12130',
            lineUserId: 'lineuserid',
            latitude: '15.50236541',
            longitude: '100.45678968'
        });
        var cus3 = new Tvdscustomer({
            title: 'นาย',
            firstName: 'กินแกรบ',
            lastName: 'วันศุกร์',
            displayName: 'กินแกรบ วันศุกร์',
            persanalId: '1180683302547',
            isShareHolder: false,
            mobileNo1: '0965874123',
            mobileNo2: '0567896521',
            mobileNo3: '0874563219',
            addressLine1: '26/1',
            addressStreet: 'วงแหวนลำลูกกา',
            addressSubdistric: 'คูคต',
            addressDistric: 'ลำลูกกา',
            addressProvince: 'ปทุมธานี',
            addressPostcode: '12130',
            lineUserId: 'lineuserid',
            latitude: '15.50236541',
            longitude: '100.45678968'
        });
        var cus4 = new Tvdscustomer({
            title: 'นาย',
            firstName: 'วันหยุด',
            lastName: 'เสาร์อาทิตย์',
            displayName: 'วันหยุด เสาร์อาทิตย์',
            persanalId: '1180773302547',
            isShareHolder: false,
            mobileNo1: '0965874123',
            mobileNo2: '0567896521',
            mobileNo3: '0874563219',
            addressLine1: '26/1',
            addressStreet: 'วงแหวนลำลูกกา',
            addressSubdistric: 'คูคต',
            addressDistric: 'ลำลูกกา',
            addressProvince: 'ปทุมธานี',
            addressPostcode: '12130',
            lineUserId: 'lineuserid',
            latitude: '15.50236541',
            longitude: ''
        });

        var body = {
            "docdate": "2020-10-03"
        };

        cus1.save(function (err, data1) {
            if (err) return done(err);
            cus2.save(function (err, data2) {
                if (err) return done(err);
                cus3.save(function (err, data3) {
                    if (err) return done(err);
                    cus4.save(function (err, data4) {
                        if (err) return done(err);

                        var job1 = new Joborder({
                            "docno": "2020-10-0001",
                            "docdate": "2020-10-01",
                            "carNo": "01",
                            "orderStatus": "draft",
                            "contactLists": [{
                                _id: data1._id,
                                contactStatus: "select",
                                isShareHolder: data1.isShareHolder
                            }]
                        });

                        var job2 = new Joborder({
                            "docno": "2020-10-0002",
                            "docdate": "2020-10-03",
                            "carNo": "03",
                            "orderStatus": "draft",
                            "contactLists": [{
                                _id: data2._id,
                                contactStatus: "confirm",
                                isShareHolder: data2.isShareHolder
                            }, {
                                _id: data3._id,
                                contactStatus: "reject",
                                isShareHolder: data3.isShareHolder
                            }]
                        });

                        job1.save(function (err, job1) {
                            if (err) return done(err);
                            job2.save(function (err, job2) {
                                if (err) return done(err);

                                request(app)
                                    .post('/api/jobordersupdatemap')
                                    .set('Authorization', 'Bearer ' + token)
                                    .send(body)
                                    .expect(200)
                                    .end(function (err, res) {
                                        if (err) {
                                            return done(err);
                                        }
                                        var resp = res.body;
                                        // console.log(resp.data);
                                        assert.equal(resp.data.length, 3)
                                        assert.equal(resp.data[0].contactStatus, '')
                                        assert.equal(resp.data[1].contactStatus, 'confirm')
                                        assert.equal(resp.data[1].docno, "2020-10-0002")
                                        assert.equal(resp.data[2].contactStatus, 'reject')
                                        assert.equal(resp.data[2].docno, "2020-10-0002")
                                        done();
                                    });
                            });
                        });
                    });
                });
            });
        });
    });

    it('should be joborder get not use token', (done) => {
        request(app)
            .get('/api/joborders')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be joborder post not use token', function (done) {

        request(app)
            .post('/api/joborders')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be joborder put not use token', function (done) {

        request(app)
            .post('/api/joborders')
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
                    .put('/api/joborders/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be joborder delete not use token', function (done) {

        request(app)
            .post('/api/joborders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/joborders/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Joborder.deleteMany().exec(done);
    });

});