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
            lisenceID: 'ทบ-559',
            startDate: '2020-04-08',
            endDate: '2020-04-15',
            driverInfo: {
                title: 'นาย',
                firstName: 'ไข่ดิบ',
                lastName: 'ไม่แพงแล้ว',
                displayName: 'ไข่ดิบ ไม่แพงแล้ว',
                persanalId: '1159569636985',
                isShareHolder: true,
                mobileNo1: '0856953265',
                mobileNo2: '',
                mobileNo3: '',
                addressLine1: '82/668',
                addressStreet: 'ลำลูกกา',
                addressSubDistrict: 'คูคต',
                addressDistrict: 'ลำลูกกา',
                addressProvince: 'ปทุมธานี',
                addressPostCode: '12130',
                lineUserId: 'L48K25369dbY89',
                latitude: '13.22202',
                longitude: '16.555697'
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
                        // assert.equal(resp.data.startDate, mockup.startDate);
                        // assert.equal(resp.data.endDate, mockup.endDate);
                        assert.equal(resp.data.driverInfo.title, mockup.driverInfo.title);
                        assert.equal(resp.data.driverInfo.firstName, mockup.driverInfo.firstName);
                        assert.equal(resp.data.driverInfo.lastName, mockup.driverInfo.lastName);
                        assert.equal(resp.data.driverInfo.displayName, mockup.driverInfo.displayName);
                        assert.equal(resp.data.driverInfo.persanalId, mockup.driverInfo.persanalId);
                        assert.equal(resp.data.driverInfo.isShareHolder, mockup.driverInfo.isShareHolder);
                        assert.equal(resp.data.driverInfo.mobileNo1, mockup.driverInfo.mobileNo1);
                        assert.equal(resp.data.driverInfo.mobileNo2, mockup.driverInfo.mobileNo2);
                        assert.equal(resp.data.driverInfo.mobileNo3, mockup.driverInfo.mobileNo3);
                        assert.equal(resp.data.driverInfo.addressLine1, mockup.driverInfo.addressLine1);
                        assert.equal(resp.data.driverInfo.addressStreet, mockup.driverInfo.addressStreet);
                        assert.equal(resp.data.driverInfo.addressSubDistrict, mockup.driverInfo.addressSubDistrict);
                        assert.equal(resp.data.driverInfo.addressDistrict, mockup.driverInfo.addressDistrict);
                        assert.equal(resp.data.driverInfo.addressProvince, mockup.driverInfo.addressProvince);
                        assert.equal(resp.data.driverInfo.addressPostCode, mockup.driverInfo.addressPostCode);
                        assert.equal(resp.data.driverInfo.lineUserId, mockup.driverInfo.lineUserId);
                        assert.equal(resp.data.driverInfo.latitude, mockup.driverInfo.latitude);
                        assert.equal(resp.data.driverInfo.longitude, mockup.driverInfo.longitude);
                        
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
                // assert.equal(resp.data.startDate, mockup.startDate);
                // assert.equal(resp.data.endDate, mockup.endDate);
                assert.equal(resp.data.driverInfo.title, mockup.driverInfo.title);
                assert.equal(resp.data.driverInfo.firstName, mockup.driverInfo.firstName);
                assert.equal(resp.data.driverInfo.lastName, mockup.driverInfo.lastName);
                assert.equal(resp.data.driverInfo.displayName, mockup.driverInfo.displayName);
                assert.equal(resp.data.driverInfo.persanalId, mockup.driverInfo.persanalId);
                assert.equal(resp.data.driverInfo.isShareHolder, mockup.driverInfo.isShareHolder);
                assert.equal(resp.data.driverInfo.mobileNo1, mockup.driverInfo.mobileNo1);
                assert.equal(resp.data.driverInfo.mobileNo2, mockup.driverInfo.mobileNo2);
                assert.equal(resp.data.driverInfo.mobileNo3, mockup.driverInfo.mobileNo3);
                assert.equal(resp.data.driverInfo.addressLine1, mockup.driverInfo.addressLine1);
                assert.equal(resp.data.driverInfo.addressStreet, mockup.driverInfo.addressStreet);
                assert.equal(resp.data.driverInfo.addressSubDistrict, mockup.driverInfo.addressSubDistrict);
                assert.equal(resp.data.driverInfo.addressDistrict, mockup.driverInfo.addressDistrict);
                assert.equal(resp.data.driverInfo.addressProvince, mockup.driverInfo.addressProvince);
                assert.equal(resp.data.driverInfo.addressPostCode, mockup.driverInfo.addressPostCode);
                assert.equal(resp.data.driverInfo.lineUserId, mockup.driverInfo.lineUserId);
                assert.equal(resp.data.driverInfo.latitude, mockup.driverInfo.latitude);
                assert.equal(resp.data.driverInfo.longitude, mockup.driverInfo.longitude);
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
                        // assert.equal(resp.data.startDate, mockup.startDate);
                        // assert.equal(resp.data.endDate, mockup.endDate);
                        assert.equal(resp.data.driverInfo.title, mockup.driverInfo.title);
                        assert.equal(resp.data.driverInfo.firstName, mockup.driverInfo.firstName);
                        assert.equal(resp.data.driverInfo.lastName, mockup.driverInfo.lastName);
                        assert.equal(resp.data.driverInfo.displayName, mockup.driverInfo.displayName);
                        assert.equal(resp.data.driverInfo.persanalId, mockup.driverInfo.persanalId);
                        assert.equal(resp.data.driverInfo.isShareHolder, mockup.driverInfo.isShareHolder);
                        assert.equal(resp.data.driverInfo.mobileNo1, mockup.driverInfo.mobileNo1);
                        assert.equal(resp.data.driverInfo.mobileNo2, mockup.driverInfo.mobileNo2);
                        assert.equal(resp.data.driverInfo.mobileNo3, mockup.driverInfo.mobileNo3);
                        assert.equal(resp.data.driverInfo.addressLine1, mockup.driverInfo.addressLine1);
                        assert.equal(resp.data.driverInfo.addressStreet, mockup.driverInfo.addressStreet);
                        assert.equal(resp.data.driverInfo.addressSubDistrict, mockup.driverInfo.addressSubDistrict);
                        assert.equal(resp.data.driverInfo.addressDistrict, mockup.driverInfo.addressDistrict);
                        assert.equal(resp.data.driverInfo.addressProvince, mockup.driverInfo.addressProvince);
                        assert.equal(resp.data.driverInfo.addressPostCode, mockup.driverInfo.addressPostCode);
                        assert.equal(resp.data.driverInfo.lineUserId, mockup.driverInfo.lineUserId);
                        assert.equal(resp.data.driverInfo.latitude, mockup.driverInfo.latitude);
                        assert.equal(resp.data.driverInfo.longitude, mockup.driverInfo.longitude);
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

    xit('should be vehicle get not use token', (done) => {
        request(app)
            .get('/api/vehicles')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    xit('should be vehicle post not use token', function (done) {

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

    xit('should be vehicle put not use token', function (done) {

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

    xit('should be vehicle delete not use token', function (done) {

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