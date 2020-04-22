'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Vehicle = mongoose.model('Vehicle');

var credentials,
    token,
    mockup;

describe('Vehicle CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            "lisenceID": "ทบ-559",
            "ownerInfo": {
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

    it('should be Vehicle get use token', (done) => {
        request(app)
            .get('/api/vehicles')
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

    it('should be Vehicle get by id', function (done) {

        request(app)
            .post('/api/vehicles')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/vehicles/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp.data);
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.lisenceID, mockup.lisenceID);
                        assert.equal(resp.data.ownerInfo.title, mockup.ownerInfo.title);
                        assert.equal(resp.data.ownerInfo.firstName, mockup.ownerInfo.firstName);
                        assert.equal(resp.data.ownerInfo.lastName, mockup.ownerInfo.lastName);
                        assert.equal(resp.data.ownerInfo.displayName, mockup.ownerInfo.displayName);
                        assert.equal(resp.data.ownerInfo.persanalId, mockup.ownerInfo.persanalId);
                        assert.equal(resp.data.ownerInfo.isShareHolder, mockup.ownerInfo.isShareHolder);
                        assert.equal(resp.data.ownerInfo.mobileNo1, mockup.ownerInfo.mobileNo1);
                        assert.equal(resp.data.ownerInfo.mobileNo2, mockup.ownerInfo.mobileNo2);
                        assert.equal(resp.data.ownerInfo.mobileNo3, mockup.ownerInfo.mobileNo3);
                        assert.equal(resp.data.ownerInfo.addressLine1, mockup.ownerInfo.addressLine1);
                        assert.equal(resp.data.ownerInfo.addressStreet, mockup.ownerInfo.addressStreet);
                        assert.equal(resp.data.ownerInfo.addressSubDistrict, mockup.ownerInfo.addressSubDistrict);
                        assert.equal(resp.data.ownerInfo.addressDistrict, mockup.ownerInfo.addressDistrict);
                        assert.equal(resp.data.ownerInfo.addressProvince, mockup.ownerInfo.addressProvince);
                        assert.equal(resp.data.ownerInfo.addressPostCode, mockup.ownerInfo.addressPostCode);
                        assert.equal(resp.data.ownerInfo.lineUserId, mockup.ownerInfo.lineUserId);
                        assert.equal(resp.data.ownerInfo.latitude, mockup.ownerInfo.latitude);
                        assert.equal(resp.data.ownerInfo.longitude, mockup.ownerInfo.longitude);
                        done();
                    });
            });

    });

    it('should be Vehicle post use token', (done) => {
        request(app)
            .post('/api/vehicles')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.lisenceID, mockup.lisenceID);
                assert.equal(resp.data.ownerInfo.title, mockup.ownerInfo.title);
                assert.equal(resp.data.ownerInfo.firstName, mockup.ownerInfo.firstName);
                assert.equal(resp.data.ownerInfo.lastName, mockup.ownerInfo.lastName);
                assert.equal(resp.data.ownerInfo.displayName, mockup.ownerInfo.displayName);
                assert.equal(resp.data.ownerInfo.persanalId, mockup.ownerInfo.persanalId);
                assert.equal(resp.data.ownerInfo.isShareHolder, mockup.ownerInfo.isShareHolder);
                assert.equal(resp.data.ownerInfo.mobileNo1, mockup.ownerInfo.mobileNo1);
                assert.equal(resp.data.ownerInfo.mobileNo2, mockup.ownerInfo.mobileNo2);
                assert.equal(resp.data.ownerInfo.mobileNo3, mockup.ownerInfo.mobileNo3);
                assert.equal(resp.data.ownerInfo.addressLine1, mockup.ownerInfo.addressLine1);
                assert.equal(resp.data.ownerInfo.addressStreet, mockup.ownerInfo.addressStreet);
                assert.equal(resp.data.ownerInfo.addressSubDistrict, mockup.ownerInfo.addressSubDistrict);
                assert.equal(resp.data.ownerInfo.addressDistrict, mockup.ownerInfo.addressDistrict);
                assert.equal(resp.data.ownerInfo.addressProvince, mockup.ownerInfo.addressProvince);
                assert.equal(resp.data.ownerInfo.addressPostCode, mockup.ownerInfo.addressPostCode);
                assert.equal(resp.data.ownerInfo.lineUserId, mockup.ownerInfo.lineUserId);
                assert.equal(resp.data.ownerInfo.latitude, mockup.ownerInfo.latitude);
                assert.equal(resp.data.ownerInfo.longitude, mockup.ownerInfo.longitude);
                done();
            });
    });

    it('should be vehicle put use token', function (done) {

        request(app)
            .post('/api/vehicles')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    "lisenceID": 'lisenceID update'
                }
                request(app)
                    .put('/api/vehicles/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.lisenceID, update.lisenceID);
                        assert.equal(resp.data.ownerInfo.title, mockup.ownerInfo.title);
                        assert.equal(resp.data.ownerInfo.firstName, mockup.ownerInfo.firstName);
                        assert.equal(resp.data.ownerInfo.lastName, mockup.ownerInfo.lastName);
                        assert.equal(resp.data.ownerInfo.displayName, mockup.ownerInfo.displayName);
                        assert.equal(resp.data.ownerInfo.persanalId, mockup.ownerInfo.persanalId);
                        assert.equal(resp.data.ownerInfo.isShareHolder, mockup.ownerInfo.isShareHolder);
                        assert.equal(resp.data.ownerInfo.mobileNo1, mockup.ownerInfo.mobileNo1);
                        assert.equal(resp.data.ownerInfo.mobileNo2, mockup.ownerInfo.mobileNo2);
                        assert.equal(resp.data.ownerInfo.mobileNo3, mockup.ownerInfo.mobileNo3);
                        assert.equal(resp.data.ownerInfo.addressLine1, mockup.ownerInfo.addressLine1);
                        assert.equal(resp.data.ownerInfo.addressStreet, mockup.ownerInfo.addressStreet);
                        assert.equal(resp.data.ownerInfo.addressSubDistrict, mockup.ownerInfo.addressSubDistrict);
                        assert.equal(resp.data.ownerInfo.addressDistrict, mockup.ownerInfo.addressDistrict);
                        assert.equal(resp.data.ownerInfo.addressProvince, mockup.ownerInfo.addressProvince);
                        assert.equal(resp.data.ownerInfo.addressPostCode, mockup.ownerInfo.addressPostCode);
                        assert.equal(resp.data.ownerInfo.lineUserId, mockup.ownerInfo.lineUserId);
                        assert.equal(resp.data.ownerInfo.latitude, mockup.ownerInfo.latitude);
                        assert.equal(resp.data.ownerInfo.longitude, mockup.ownerInfo.longitude);
                        done();
                    });
            });

    });

    it('should be vehicle delete use token', function (done) {

        request(app)
            .post('/api/vehicles')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/vehicles/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be vehicle get not use token', (done) => {
        request(app)
            .get('/api/vehicles')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be vehicle post not use token', function (done) {

        request(app)
            .post('/api/vehicles')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be vehicle put not use token', function (done) {

        request(app)
            .post('/api/vehicles')
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
                    .put('/api/vehicles/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be vehicle delete not use token', function (done) {

        request(app)
            .post('/api/vehicles')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/vehicles/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Vehicle.deleteMany().exec(done);
    });

});