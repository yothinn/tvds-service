'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Postcode = mongoose.model('Postcode');

var credentials,
    token,
    mockup;

describe('Postcode CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            locationcode: '960903',
            district: 'อำเภอสุคิริน',
            province: 'นราธิวาส',
            postcode: '96190',
            subdistrict: 'เกียร์'

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

    it('should be Postcode get use token', (done)=>{
        request(app)
        .get('/api/postcodes')
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

    it('should be Postcode get by id', function (done) {

        request(app)
            .post('/api/postcodes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/postcodes/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.locationcode, mockup.locationcode);
                        assert.equal(resp.data.district, mockup.district);
                        assert.equal(resp.data.province, mockup.province);
                        assert.equal(resp.data.postcode, mockup.postcode);
                        assert.equal(resp.data.subdistrict, mockup.subdistrict);
                        done();
                    });
            });

    });

    it('should be Postcode post use token', (done)=>{
        request(app)
            .post('/api/postcodes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.locationcode, mockup.locationcode);
                assert.equal(resp.data.district, mockup.district);
                assert.equal(resp.data.province, mockup.province);
                assert.equal(resp.data.postcode, mockup.postcode);
                assert.equal(resp.data.subdistrict, mockup.subdistrict);
                done();
            });
    });

    it('should be postcode put use token', function (done) {

        request(app)
            .post('/api/postcodes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    locationcode: '960907',
                    district: 'อำเภอสุคิรินริน',
                    province: 'นราธิวาสวาส',
                    postcode: '96197',
                    subdistrict: 'เกียร์เกียร์'
                }
                request(app)
                    .put('/api/postcodes/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.locationcode, update.locationcode);
                        assert.equal(resp.data.district, upadate.district);
                        assert.equal(resp.data.province, update.province);
                        assert.equal(resp.data.postcode, update.postcode);
                        assert.equal(resp.data.subdistrict, update.subdistrict);
                        done();
                    });
            });

    });

    it('should be postcode delete use token', function (done) {

        request(app)
            .post('/api/postcodes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/postcodes/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be postcode get not use token', (done)=>{
        request(app)
        .get('/api/postcodes')
        .expect(403)
        .expect({
            status: 403,
            message: 'User is not authorized'
        })
        .end(done);
    });

    xit('should be postcode post not use token', function (done) {

        request(app)
            .post('/api/postcodes')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be postcode put not use token', function (done) {

        request(app)
            .post('/api/postcodes')
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
                    .put('/api/postcodes/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be postcode delete not use token', function (done) {

        request(app)
            .post('/api/postcodes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/postcodes/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Postcode.deleteMany().exec(done);
    });

});