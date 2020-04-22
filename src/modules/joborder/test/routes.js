'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Joborder = mongoose.model('Joborder');

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