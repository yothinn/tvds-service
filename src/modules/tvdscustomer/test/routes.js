'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Tvdscustomer = mongoose.model('Tvdscustomer');

var credentials,
    token,
    mockup;

describe('Tvdscustomer CRUD routes tests', function () {

    before(function (done) {
        mockup = {
           
            title: 'นาย',
            firstName: 'ประหยัด',
            lastName: 'จันทร์อังคาร',
            // displayName: 'ประหยัด จันทร์อังคาร',    
            persanalId: '1180233302547',   
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

    it('should be Tvdscustomer get use token', (done)=>{
        request(app)
        .get('/api/tvdscustomers')
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

    it('should be Tvdscustomer get by id', function (done) {

        request(app)
            .post('/api/tvdscustomers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/tvdscustomers/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp.data)
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.title, mockup.title);
                        assert.equal(resp.data.firstName, mockup.firstName);
                        assert.equal(resp.data.lastName, mockup.lastName);
                        // assert.equal(resp.data.displayName, mockup.displayName);
                        assert.equal(resp.data.persanalId, mockup.persanalId);
                        assert.equal(resp.data.isShareHolder, mockup.isShareHolder);
                        assert.equal(resp.data.mobileNo1, mockup.mobileNo1);
                        assert.equal(resp.data.mobileNo2, mockup.mobileNo2);
                        assert.equal(resp.data.mobileNo3, mockup.mobileNo3);
                        assert.equal(resp.data.addressLine1, mockup.addressLine1);
                        assert.equal(resp.data.addressStreet, mockup.addressStreet);
                        assert.equal(resp.data.addressSubdistric, mockup.addressSubdistric);
                        assert.equal(resp.data.addressDistric, mockup.addressDistric);
                        assert.equal(resp.data.addressProvince, mockup.addressProvince);
                        assert.equal(resp.data.addressPostcode, mockup.addressPostcode);
                        assert.equal(resp.data.lineUserId, mockup.lineUserId);
                        assert.equal(resp.data.latitude, mockup.latitude);
                        assert.equal(resp.data.longitude, mockup.longitude);

                        done();
                    });
            });

    });

    it('should be Tvdscustomer post use token', (done)=>{
        request(app)
            .post('/api/tvdscustomers')
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
                        assert.equal(resp.data.persanalId, mockup.persanalId);
                        assert.equal(resp.data.isShareHolder, mockup.isShareHolder);
                        assert.equal(resp.data.mobileNo1, mockup.mobileNo1);
                        assert.equal(resp.data.mobileNo2, mockup.mobileNo2);
                        assert.equal(resp.data.mobileNo3, mockup.mobileNo3);
                        assert.equal(resp.data.addressLine1, mockup.addressLine1);
                        assert.equal(resp.data.addressStreet, mockup.addressStreet);
                        assert.equal(resp.data.addressSubdistric, mockup.addressSubdistric);
                        assert.equal(resp.data.addressDistric, mockup.addressDistric);
                        assert.equal(resp.data.addressProvince, mockup.addressProvince);
                        assert.equal(resp.data.addressPostcode, mockup.addressPostcode);
                        assert.equal(resp.data.lineUserId, mockup.lineUserId);
                        assert.equal(resp.data.latitude, mockup.latitude);
                        assert.equal(resp.data.longitude, mockup.longitude);
                done();
            });
    });

    it('should be tvdscustomer put use token', function (done) {

        request(app)
            .post('/api/tvdscustomers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    title: 'นางสาว'
                }
                request(app)
                    .put('/api/tvdscustomers/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.title, update.title);
                        assert.equal(resp.data.firstName, mockup.firstName);
                        assert.equal(resp.data.lastName, mockup.lastName);
                        // assert.equal(resp.data.displayName, mockup.displayName);
                        assert.equal(resp.data.persanalId, mockup.persanalId);
                        assert.equal(resp.data.isShareHolder, mockup.isShareHolder);
                        assert.equal(resp.data.mobileNo1, mockup.mobileNo1);
                        assert.equal(resp.data.mobileNo2, mockup.mobileNo2);
                        assert.equal(resp.data.mobileNo3, mockup.mobileNo3);
                        assert.equal(resp.data.addressLine1, mockup.addressLine1);
                        assert.equal(resp.data.addressStreet, mockup.addressStreet);
                        assert.equal(resp.data.addressSubdistric, mockup.addressSubdistric);
                        assert.equal(resp.data.addressDistric, mockup.addressDistric);
                        assert.equal(resp.data.addressProvince, mockup.addressProvince);
                        assert.equal(resp.data.addressPostcode, mockup.addressPostcode);
                        assert.equal(resp.data.lineUserId, mockup.lineUserId);
                        assert.equal(resp.data.latitude, mockup.latitude);
                        assert.equal(resp.data.longitude, mockup.longitude);
                        done();
                    });
            });

    });

    it('should be tvdscustomer delete use token', function (done) {

        request(app)
            .post('/api/tvdscustomers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/tvdscustomers/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be tvdscustomer get not use token', (done)=>{
        request(app)
        .get('/api/tvdscustomers')
        .expect(403)
        .expect({
            status: 403,
            message: 'User is not authorized'
        })
        .end(done);
    });

    xit('should be tvdscustomer post not use token', function (done) {

        request(app)
            .post('/api/tvdscustomers')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be tvdscustomer put not use token', function (done) {

        request(app)
            .post('/api/tvdscustomers')
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
                    .put('/api/tvdscustomers/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be tvdscustomer delete not use token', function (done) {

        request(app)
            .post('/api/tvdscustomers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/tvdscustomers/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Tvdscustomer.deleteMany().exec(done);
    });

});