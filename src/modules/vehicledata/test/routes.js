'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Vehicledata = mongoose.model('Vehicledata');

var credentials,
    token,
    mockup;

describe('Vehicledata CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            lisenceID: 'ทง744',
            vehicleType: 'กระบะตอนเดียว',
            vehicleColor: 'ดำ',
            vehicleBrand: 'toyota',
            isOwner: true,
            ownerInfo: {
                title: 'นาย',
                firstName: 'ไข่ดิบ',
                lastName: 'ไม่แพงแล้ว',
                displayName: 'ไข่ดิบ ไม่แพงแล้ว',
                isCompany: false,
                refId: '1231231231231',
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

    it('should be Vehicledata get use token', (done)=>{
        request(app)
        .get('/api/vehicledatas')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end((err, res)=>{
            if (err) {
                return done(err);
            }
            var resp = res.body;
            done();
        });
    });

    it('should be Vehicledata get by id', function (done) {

        request(app)
            .post('/api/vehicledatas')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/vehicledatas/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        
                        assert.equal(resp.data.lisenceID, mockup.lisenceID);

                        assert.equal(resp.data.vehicleType, mockup.vehicleType);
                        assert.equal(resp.data.vehicleColor, mockup.vehicleColor);
                        assert.equal(resp.data.vehicleBrand, mockup.vehicleBrand);
                        assert.equal(resp.data.isOwner, mockup.isOwner);

                        assert.equal(resp.data.ownerInfo.title, mockup.ownerInfo.title);
                        assert.equal(resp.data.ownerInfo.firstName, mockup.ownerInfo.firstName);
                        assert.equal(resp.data.ownerInfo.lastName, mockup.ownerInfo.lastName);
                        assert.equal(resp.data.ownerInfo.displayName, mockup.ownerInfo.displayName);
                        assert.equal(resp.data.ownerInfo.isCompany, mockup.ownerInfo.isCompany);
                        assert.equal(resp.data.ownerInfo.refId, mockup.ownerInfo.refId);
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

    it('should be Vehicledata post use token', (done)=>{
        request(app)
            .post('/api/vehicledatas')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.lisenceID, mockup.lisenceID);

                assert.equal(resp.data.vehicleType, mockup.vehicleType);
                assert.equal(resp.data.vehicleColor, mockup.vehicleColor);
                assert.equal(resp.data.vehicleBrand, mockup.vehicleBrand);
                assert.equal(resp.data.isOwner, mockup.isOwner);

                assert.equal(resp.data.ownerInfo.title, mockup.ownerInfo.title);
                assert.equal(resp.data.ownerInfo.firstName, mockup.ownerInfo.firstName);
                assert.equal(resp.data.ownerInfo.lastName, mockup.ownerInfo.lastName);
                assert.equal(resp.data.ownerInfo.displayName, mockup.ownerInfo.displayName);
                assert.equal(resp.data.ownerInfo.isCompany, mockup.ownerInfo.isCompany);
                assert.equal(resp.data.ownerInfo.refId, mockup.ownerInfo.refId);
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

    it('should be vehicledata put use token', function (done) {

        request(app)
            .post('/api/vehicledatas')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    lisenceID: 'นช111'
                }
                request(app)
                    .put('/api/vehicledatas/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        console.log(resp.data);
                        assert.equal(resp.data.lisenceID, update.lisenceID);

                        assert.equal(resp.data.vehicleType, mockup.vehicleType);
                        assert.equal(resp.data.vehicleColor, mockup.vehicleColor);
                        assert.equal(resp.data.vehicleBrand, mockup.vehicleBrand);
                        assert.equal(resp.data.isOwner, mockup.isOwner);

                        assert.equal(resp.data.ownerInfo.title, mockup.ownerInfo.title);
                        assert.equal(resp.data.ownerInfo.firstName, mockup.ownerInfo.firstName);
                        assert.equal(resp.data.ownerInfo.lastName, mockup.ownerInfo.lastName);
                        assert.equal(resp.data.ownerInfo.displayName, mockup.ownerInfo.displayName);
                        assert.equal(resp.data.ownerInfo.isCompany, mockup.ownerInfo.isCompany);
                        assert.equal(resp.data.ownerInfo.refId, mockup.ownerInfo.refId);
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

    it('should be vehicledata delete use token', function (done) {

        request(app)
            .post('/api/vehicledatas')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/vehicledatas/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be vehicledata get not use token', (done)=>{
        request(app)
        .get('/api/vehicledatas')
        .expect(403)
        .expect({
            status: 403,
            message: 'User is not authorized'
        })
        .end(done);
    });

    it('should be vehicledata post not use token', function (done) {

        request(app)
            .post('/api/vehicledatas')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be vehicledata put not use token', function (done) {

        request(app)
            .post('/api/vehicledatas')
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
                    .put('/api/vehicledatas/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be vehicledata delete not use token', function (done) {

        request(app)
            .post('/api/vehicledatas')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/vehicledatas/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Vehicledata.deleteMany().exec(done);
    });

});