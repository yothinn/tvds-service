'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Vehiclestaff = mongoose.model('Vehiclestaff');

var credentials,
    token,
    mockup;

describe('Vehiclestaff CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            title: 'นาย',
            firstName: 'อาสาขับรถ',
            lastName: 'รถธรรมธุรกิจ',
            // displayName: 'ประหยัด จันทร์อังคาร',    
            driverId: '12345678',
            persanalId: '1180233302547',   
            isShareHolder: false,
            mobileNo1: '0965874123',
            mobileNo2: '0567896521',
            mobileNo3: '0874563219',
            addressLine1: '26/1',
            addressStreet: 'วงแหวนลำลูกกา',
            addressSubDistrict: 'คูคต',
            addressDistrict: 'ลำลูกกา',
            addressProvince: 'ปทุมธานี',
            addressPostCode: '12130',
            lineUserId: 'lineuserid',
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

    it('should be Vehiclestaff get use token', (done)=>{
        request(app)
        .get('/api/vehiclestaffs')
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

    it('should be Vehiclestaff get by id', function (done) {

        request(app)
            .post('/api/vehiclestaffs')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/vehiclestaffs/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.title, mockup.title);
                        assert.equal(resp.data.firstName, mockup.firstName);
                        assert.equal(resp.data.lastName, mockup.lastName);
                        // assert.equal(resp.data.displayName, mockup.displayName);
                        assert.equal(resp.data.driverId, mockup.driverId);
                        assert.equal(resp.data.persanalId, mockup.persanalId);
                        assert.equal(resp.data.isShareHolder, mockup.isShareHolder);
                        assert.equal(resp.data.mobileNo1, mockup.mobileNo1);
                        assert.equal(resp.data.mobileNo2, mockup.mobileNo2);
                        assert.equal(resp.data.mobileNo3, mockup.mobileNo3);
                        assert.equal(resp.data.addressLine1, mockup.addressLine1);
                        assert.equal(resp.data.addressStreet, mockup.addressStreet);
                        assert.equal(resp.data.addressSubDistrict, mockup.addressSubDistrict);
                        assert.equal(resp.data.addressDistrict, mockup.addressDistrict);
                        assert.equal(resp.data.addressProvince, mockup.addressProvince);
                        assert.equal(resp.data.addressPostCode, mockup.addressPostCode);
                        assert.equal(resp.data.lineUserId, mockup.lineUserId);
                        
                        done();
                    });
            });

    });

    it('should be Vehiclestaff post use token', (done)=>{
        request(app)
            .post('/api/vehiclestaffs')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.title, mockup.title);
                assert.equal(resp.data.firstName, mockup.firstName);
                assert.equal(resp.data.lastName, mockup.lastName);
                // assert.equal(resp.data.displayName, mockup.displayName);
                assert.equal(resp.data.driverId, mockup.driverId);
                assert.equal(resp.data.persanalId, mockup.persanalId);
                assert.equal(resp.data.isShareHolder, mockup.isShareHolder);
                assert.equal(resp.data.mobileNo1, mockup.mobileNo1);
                assert.equal(resp.data.mobileNo2, mockup.mobileNo2);
                assert.equal(resp.data.mobileNo3, mockup.mobileNo3);
                assert.equal(resp.data.addressLine1, mockup.addressLine1);
                assert.equal(resp.data.addressStreet, mockup.addressStreet);
                assert.equal(resp.data.addressSubDistrict, mockup.addressSubDistrict);
                assert.equal(resp.data.addressDistrict, mockup.addressDistrict);
                assert.equal(resp.data.addressProvince, mockup.addressProvince);
                assert.equal(resp.data.addressPostCode, mockup.addressPostCode);
                assert.equal(resp.data.lineUserId, mockup.lineUserId);

                done();
            });
    });

    it('should be vehiclestaff put use token', function (done) {

        request(app)
            .post('/api/vehiclestaffs')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    firstName: 'อาสาสมัคร'
                }
                request(app)
                    .put('/api/vehiclestaffs/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.title, mockup.title);
                        assert.equal(resp.data.firstName, update.firstName);
                        assert.equal(resp.data.lastName, mockup.lastName);
                        // assert.equal(resp.data.displayName, mockup.displayName);
                        assert.equal(resp.data.driverId, mockup.driverId);
                        assert.equal(resp.data.persanalId, mockup.persanalId);
                        assert.equal(resp.data.isShareHolder, mockup.isShareHolder);
                        assert.equal(resp.data.mobileNo1, mockup.mobileNo1);
                        assert.equal(resp.data.mobileNo2, mockup.mobileNo2);
                        assert.equal(resp.data.mobileNo3, mockup.mobileNo3);
                        assert.equal(resp.data.addressLine1, mockup.addressLine1);
                        assert.equal(resp.data.addressStreet, mockup.addressStreet);
                        assert.equal(resp.data.addressSubDistric, mockup.addressSubDistric);
                        assert.equal(resp.data.addressDistrict, mockup.addressDistrict);
                        assert.equal(resp.data.addressProvince, mockup.addressProvince);
                        assert.equal(resp.data.addressPostCode, mockup.addressPostCode);
                        assert.equal(resp.data.lineUserId, mockup.lineUserId);
                        done();
                    });
            });

    });

    it('should be vehiclestaff delete use token', function (done) {

        request(app)
            .post('/api/vehiclestaffs')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/vehiclestaffs/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be vehiclestaff get not use token', (done)=>{
        request(app)
        .get('/api/vehiclestaffs')
        .expect(403)
        .expect({
            status: 403,
            message: 'User is not authorized'
        })
        .end(done);
    });

    xit('should be vehiclestaff post not use token', function (done) {

        request(app)
            .post('/api/vehiclestaffs')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be vehiclestaff put not use token', function (done) {

        request(app)
            .post('/api/vehiclestaffs')
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
                    .put('/api/vehiclestaffs/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be vehiclestaff delete not use token', function (done) {

        request(app)
            .post('/api/vehiclestaffs')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/vehiclestaffs/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Vehiclestaff.deleteMany().exec(done);
    });

});