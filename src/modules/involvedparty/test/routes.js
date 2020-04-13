'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Involvedparty = mongoose.model('Involvedparty');

var credentials,
    token,
    mockup;

describe('Involvedparty CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            involedPartyID: 'partyid001',
            involvedPartyType: 'partytype1',
            taxID: 'taxid01',
            otherUniqueID: 'ss5555',
            otherUniqueIDType: 'ss5555',
            nationality: 'ไทย',
            countryOfResidence: 'กรุงเทพ',
            documentActive: true,
            relationType: 'member',
            personalInfo: {
                title: 'mr',
                titleThai: 'นาย',
                firstName: 'yut',
                firstNameThai: 'ยุทธ',
                middleName: 'middle',
                middleNameThai: 'กลาง',
                lastName: 'ocha',
                lastNameThai: 'โอชา',
                luId: 'lineid',
                citizenId: '1178844475698',
                dateOfBirth: '2020-04-08',
                gender: 'ชาย'
            },
            directContact: [
                {
                    method: 'เบอร์มือถือ',
                    value: '0987451255'
                }
            ],
            juristicPersonInfo: {
                juristicID: 'aaa777',
                juristicRegisteredDate: '2020-04-08',
                companyName: '3m company',
                companyNameThai: 'บริษัท 3ม',
                BusinessType: ['BusinessType']
            },
            registeredAddress: {
                addressLine1: 'บ้านเลขที่ 27/9',
                addressStreet: 'วงแหวนลำลูกกา',
                addressSubDistrict: 'บึงคำพร้อย',
                addressDistrict: 'ลำลูกกา',
                addressProvince: 'ปทุมธานี',
                addressCountry: 'ไทย',
                addressPostalCode: '12130',
                latitude: '13.4445478',
                longitude: '526.4597845'
            },
            contactUseRegAddress: true,
            contactAddress: {
                addressLine1: 'บ้านเลขที่ 78/1',
                addressStreet: 'วงแหวนลำลูกกา',
                addressSubDistrict: 'บึงคำพร้อย',
                addressDistrict: 'ลำลูกกา',
                addressProvince: 'ปทุมธานี',
                addressCountry: 'ไทย',
                addressPostalCode: '12130',
                latitude: '17.2564785',
                longitude: '856.8547456'
            },
            ipIPRelationship: [
                {
                    involedPartyID: 'partyid001',
                    ipRelationshipType: 'relationshiptype'
                }
            ],
            businessTermAndCondition: {
                paymentTerm: 'ข้อตกลง',
                creditLimit: 1000,
                creditOnHold: 100,
                onHoldDescription: 'รายละเอียดเครดิตที่ถืออยู่',
                grade: 'เกรด'
            },
            membership: [
                {
                    activity: 'delivery',
                    memberReference: 'สมาชิก'
                }
            ],
            recordInfo: {
                createBy: 'สร้างโดย',
                createDate: '1960-01-01',
                updateBy: 'อัพเดทโดย',
                updateDate: '1960-01-01'
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

    it('should be Involvedparty get use token', (done) => {
        request(app)
            .get('/api/involvedpartys')
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

    it('should be Involvedparty get by id', function (done) {

        request(app)
            .post('/api/involvedpartys')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/involvedpartys/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp.data)
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.involedPartyID, mockup.involedPartyID);
                        assert.equal(resp.data.involvedPartyType, mockup.involvedPartyType);
                        assert.equal(resp.data.taxID, mockup.taxID);
                        assert.equal(resp.data.otherUniqueID, mockup.otherUniqueID);
                        assert.equal(resp.data.otherUniqueIDType, mockup.otherUniqueIDType);
                        assert.equal(resp.data.nationality, mockup.nationality);
                        assert.equal(resp.data.countryOfResidence, mockup.countryOfResidence);
                        assert.equal(resp.data.documentActive, mockup.documentActive);
                        assert.equal(resp.data.relationType, mockup.relationType);

                        assert.equal(resp.data.personalInfo.title, mockup.personalInfo.title);
                        assert.equal(resp.data.personalInfo.titleThai, mockup.personalInfo.titleThai);
                        assert.equal(resp.data.personalInfo.firstName, mockup.personalInfo.firstName);
                        assert.equal(resp.data.personalInfo.firstNameThai, mockup.personalInfo.firstNameThai);
                        assert.equal(resp.data.personalInfo.middleName, mockup.personalInfo.middleName);
                        assert.equal(resp.data.personalInfo.middleNameThai, mockup.personalInfo.middleNameThai);
                        assert.equal(resp.data.personalInfo.lastName, mockup.personalInfo.lastName);
                        assert.equal(resp.data.personalInfo.lastNameThai, mockup.personalInfo.lastNameThai);
                        assert.equal(resp.data.personalInfo.luId, mockup.personalInfo.luId);
                        assert.equal(resp.data.personalInfo.citizenId, mockup.personalInfo.citizenId);
                        assert.equal(resp.data.personalInfo.dateOfBirth, mockup.personalInfo.dateOfBirth);
                        assert.equal(resp.data.personalInfo.gender, mockup.personalInfo.gender);

                        assert.equal(resp.data.directContact[0].method, mockup.directContact[0].method);
                        assert.equal(resp.data.directContact[0].value, mockup.directContact[0].value);


                        assert.equal(resp.data.juristicPersonInfo.juristicID, mockup.juristicPersonInfo.juristicID);
                        assert.equal(resp.data.juristicPersonInfo.juristicRegisteredDate, mockup.juristicPersonInfo.juristicRegisteredDate);
                        assert.equal(resp.data.juristicPersonInfo.companyName, mockup.juristicPersonInfo.companyName);
                        assert.equal(resp.data.juristicPersonInfo.companyNameThai, mockup.juristicPersonInfo.companyNameThai);
                        assert.equal(resp.data.juristicPersonInfo.BusinessType[0], mockup.juristicPersonInfo.BusinessType[0]);

                        assert.equal(resp.data.registeredAddress.addressLine1, mockup.registeredAddress.addressLine1);
                        assert.equal(resp.data.registeredAddress.addressStreet, mockup.registeredAddress.addressStreet);
                        assert.equal(resp.data.registeredAddress.addressSubDistrict, mockup.registeredAddress.addressSubDistrict);
                        assert.equal(resp.data.registeredAddress.addressDistrict, mockup.registeredAddress.addressDistrict);
                        assert.equal(resp.data.registeredAddress.addressProvince, mockup.registeredAddress.addressProvince);
                        assert.equal(resp.data.registeredAddress.addressCountry, mockup.registeredAddress.addressCountry);
                        assert.equal(resp.data.registeredAddress.addressPostalCode, mockup.registeredAddress.addressPostalCode);
                        assert.equal(resp.data.registeredAddress.latitude, mockup.registeredAddress.latitude);
                        assert.equal(resp.data.registeredAddress.longitude, mockup.registeredAddress.longitude);

                        assert.equal(resp.data.contactUseRegAddress, mockup.contactUseRegAddress);

                        assert.equal(resp.data.contactAddress.addressLine1, mockup.contactAddress.addressLine1);
                        assert.equal(resp.data.registeredAddress.addressStreet, mockup.registeredAddress.addressStreet);
                        assert.equal(resp.data.contactAddress.addressSubDistrict, mockup.contactAddress.addressSubDistrict);
                        assert.equal(resp.data.contactAddress.addressDistrict, mockup.contactAddress.addressDistrict);
                        assert.equal(resp.data.contactAddress.addressProvince, mockup.contactAddress.addressProvince);
                        assert.equal(resp.data.contactAddress.addressCountry, mockup.contactAddress.addressCountry);
                        assert.equal(resp.data.contactAddress.addressPostalCode, mockup.contactAddress.addressPostalCode);
                        assert.equal(resp.data.contactAddress.latitude, mockup.contactAddress.latitude);
                        assert.equal(resp.data.contactAddress.longitude, mockup.contactAddress.longitude);

                        assert.equal(resp.data.ipIPRelationship[0].involedPartyID, mockup.ipIPRelationship[0].involedPartyID);
                        assert.equal(resp.data.ipIPRelationship[0].ipRelationshipType, mockup.ipIPRelationship[0].ipRelationshipType);

                        assert.equal(resp.data.businessTermAndCondition.paymentTerm, mockup.businessTermAndCondition.paymentTerm);
                        assert.equal(resp.data.businessTermAndCondition.creditLimit, mockup.businessTermAndCondition.creditLimit);
                        assert.equal(resp.data.businessTermAndCondition.creditOnHold, mockup.businessTermAndCondition.creditOnHold);
                        assert.equal(resp.data.businessTermAndCondition.onHoldDescription, mockup.businessTermAndCondition.onHoldDescription);
                        assert.equal(resp.data.businessTermAndCondition.grade, mockup.businessTermAndCondition.grade);

                        assert.equal(resp.data.membership[0].activity, mockup.membership[0].activity);
                        assert.equal(resp.data.membership[0].memberReference, mockup.membership[0].memberReference);

                        assert.equal(resp.data.recordInfo.createBy, mockup.recordInfo.createBy);
                        assert.equal(resp.data.recordInfo.createDate, mockup.recordInfo.createDate);
                        assert.equal(resp.data.recordInfo.updateBy, mockup.recordInfo.updateBy);
                        assert.equal(resp.data.recordInfo.updateDate, mockup.recordInfo.updateDate);
                        done();
                    });
            });

    });

    it('should be Involvedparty post use token', (done) => {
        request(app)
            .post('/api/involvedpartys')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.equal(resp.data.involedPartyID, mockup.involedPartyID);
                assert.equal(resp.data.involvedPartyType, mockup.involvedPartyType);
                assert.equal(resp.data.taxID, mockup.taxID);
                assert.equal(resp.data.otherUniqueID, mockup.otherUniqueID);
                assert.equal(resp.data.otherUniqueIDType, mockup.otherUniqueIDType);
                assert.equal(resp.data.nationality, mockup.nationality);
                assert.equal(resp.data.countryOfResidence, mockup.countryOfResidence);
                assert.equal(resp.data.documentActive, mockup.documentActive);
                assert.equal(resp.data.relationType, mockup.relationType);

                assert.equal(resp.data.personalInfo.title, mockup.personalInfo.title);
                assert.equal(resp.data.personalInfo.titleThai, mockup.personalInfo.titleThai);
                assert.equal(resp.data.personalInfo.firstName, mockup.personalInfo.firstName);
                assert.equal(resp.data.personalInfo.firstNameThai, mockup.personalInfo.firstNameThai);
                assert.equal(resp.data.personalInfo.middleName, mockup.personalInfo.middleName);
                assert.equal(resp.data.personalInfo.middleNameThai, mockup.personalInfo.middleNameThai);
                assert.equal(resp.data.personalInfo.lastName, mockup.personalInfo.lastName);
                assert.equal(resp.data.personalInfo.lastNameThai, mockup.personalInfo.lastNameThai);
                assert.equal(resp.data.personalInfo.luId, mockup.personalInfo.luId);
                assert.equal(resp.data.personalInfo.citizenId, mockup.personalInfo.citizenId);
                assert.equal(resp.data.personalInfo.dateOfBirth, mockup.personalInfo.dateOfBirth);
                assert.equal(resp.data.personalInfo.gender, mockup.personalInfo.gender);

                assert.equal(resp.data.directContact[0].method, mockup.directContact[0].method);
                assert.equal(resp.data.directContact[0].value, mockup.directContact[0].value);


                assert.equal(resp.data.juristicPersonInfo.juristicID, mockup.juristicPersonInfo.juristicID);
                assert.equal(resp.data.juristicPersonInfo.juristicRegisteredDate, mockup.juristicPersonInfo.juristicRegisteredDate);
                assert.equal(resp.data.juristicPersonInfo.companyName, mockup.juristicPersonInfo.companyName);
                assert.equal(resp.data.juristicPersonInfo.companyNameThai, mockup.juristicPersonInfo.companyNameThai);
                assert.equal(resp.data.juristicPersonInfo.BusinessType[0], mockup.juristicPersonInfo.BusinessType[0]);

                assert.equal(resp.data.registeredAddress.addressLine1, mockup.registeredAddress.addressLine1);
                assert.equal(resp.data.registeredAddress.addressStreet, mockup.registeredAddress.addressStreet);
                assert.equal(resp.data.registeredAddress.addressSubDistrict, mockup.registeredAddress.addressSubDistrict);
                assert.equal(resp.data.registeredAddress.addressDistrict, mockup.registeredAddress.addressDistrict);
                assert.equal(resp.data.registeredAddress.addressProvince, mockup.registeredAddress.addressProvince);
                assert.equal(resp.data.registeredAddress.addressCountry, mockup.registeredAddress.addressCountry);
                assert.equal(resp.data.registeredAddress.addressPostalCode, mockup.registeredAddress.addressPostalCode);
                assert.equal(resp.data.registeredAddress.latitude, mockup.registeredAddress.latitude);
                assert.equal(resp.data.registeredAddress.longitude, mockup.registeredAddress.longitude);

                assert.equal(resp.data.contactUseRegAddress, mockup.contactUseRegAddress);

                assert.equal(resp.data.contactAddress.addressLine1, mockup.contactAddress.addressLine1);
                assert.equal(resp.data.registeredAddress.addressStreet, mockup.registeredAddress.addressStreet);
                assert.equal(resp.data.contactAddress.addressSubDistrict, mockup.contactAddress.addressSubDistrict);
                assert.equal(resp.data.contactAddress.addressDistrict, mockup.contactAddress.addressDistrict);
                assert.equal(resp.data.contactAddress.addressProvince, mockup.contactAddress.addressProvince);
                assert.equal(resp.data.contactAddress.addressCountry, mockup.contactAddress.addressCountry);
                assert.equal(resp.data.contactAddress.addressPostalCode, mockup.contactAddress.addressPostalCode);
                assert.equal(resp.data.contactAddress.latitude, mockup.contactAddress.latitude);
                assert.equal(resp.data.contactAddress.longitude, mockup.contactAddress.longitude);

                assert.equal(resp.data.ipIPRelationship[0].involedPartyID, mockup.ipIPRelationship[0].involedPartyID);
                assert.equal(resp.data.ipIPRelationship[0].ipRelationshipType, mockup.ipIPRelationship[0].ipRelationshipType);

                assert.equal(resp.data.businessTermAndCondition.paymentTerm, mockup.businessTermAndCondition.paymentTerm);
                assert.equal(resp.data.businessTermAndCondition.creditLimit, mockup.businessTermAndCondition.creditLimit);
                assert.equal(resp.data.businessTermAndCondition.creditOnHold, mockup.businessTermAndCondition.creditOnHold);
                assert.equal(resp.data.businessTermAndCondition.onHoldDescription, mockup.businessTermAndCondition.onHoldDescription);
                assert.equal(resp.data.businessTermAndCondition.grade, mockup.businessTermAndCondition.grade);

                assert.equal(resp.data.membership[0].activity, mockup.membership[0].activity);
                assert.equal(resp.data.membership[0].memberReference, mockup.membership[0].memberReference);

                assert.equal(resp.data.recordInfo.createBy, mockup.recordInfo.createBy);
                assert.equal(resp.data.recordInfo.createDate, mockup.recordInfo.createDate);
                assert.equal(resp.data.recordInfo.updateBy, mockup.recordInfo.updateBy);
                assert.equal(resp.data.recordInfo.updateDate, mockup.recordInfo.updateDate);
                done();
            });
    });

    it('should be involvedparty put use token', function (done) {

        request(app)
            .post('/api/involvedpartys')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    involedPartyID: 'partyid007'
                }
                request(app)
                    .put('/api/involvedpartys/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.involedPartyID, update.involedPartyID);
                        assert.equal(resp.data.involvedPartyType, mockup.involvedPartyType);
                        assert.equal(resp.data.taxID, mockup.taxID);
                        assert.equal(resp.data.otherUniqueID, mockup.otherUniqueID);
                        assert.equal(resp.data.otherUniqueIDType, mockup.otherUniqueIDType);
                        assert.equal(resp.data.nationality, mockup.nationality);
                        assert.equal(resp.data.countryOfResidence, mockup.countryOfResidence);
                        assert.equal(resp.data.documentActive, mockup.documentActive);
                        assert.equal(resp.data.relationType, mockup.relationType);

                        assert.equal(resp.data.personalInfo.title, mockup.personalInfo.title);
                        assert.equal(resp.data.personalInfo.titleThai, mockup.personalInfo.titleThai);
                        assert.equal(resp.data.personalInfo.firstName, mockup.personalInfo.firstName);
                        assert.equal(resp.data.personalInfo.firstNameThai, mockup.personalInfo.firstNameThai);
                        assert.equal(resp.data.personalInfo.middleName, mockup.personalInfo.middleName);
                        assert.equal(resp.data.personalInfo.middleNameThai, mockup.personalInfo.middleNameThai);
                        assert.equal(resp.data.personalInfo.lastName, mockup.personalInfo.lastName);
                        assert.equal(resp.data.personalInfo.lastNameThai, mockup.personalInfo.lastNameThai);
                        assert.equal(resp.data.personalInfo.luId, mockup.personalInfo.luId);
                        assert.equal(resp.data.personalInfo.citizenId, mockup.personalInfo.citizenId);
                        assert.equal(resp.data.personalInfo.dateOfBirth, mockup.personalInfo.dateOfBirth);
                        assert.equal(resp.data.personalInfo.gender, mockup.personalInfo.gender);

                        assert.equal(resp.data.directContact[0].method, mockup.directContact[0].method);
                        assert.equal(resp.data.directContact[0].value, mockup.directContact[0].value);


                        assert.equal(resp.data.juristicPersonInfo.juristicID, mockup.juristicPersonInfo.juristicID);
                        assert.equal(resp.data.juristicPersonInfo.juristicRegisteredDate, mockup.juristicPersonInfo.juristicRegisteredDate);
                        assert.equal(resp.data.juristicPersonInfo.companyName, mockup.juristicPersonInfo.companyName);
                        assert.equal(resp.data.juristicPersonInfo.companyNameThai, mockup.juristicPersonInfo.companyNameThai);
                        assert.equal(resp.data.juristicPersonInfo.BusinessType[0], mockup.juristicPersonInfo.BusinessType[0]);

                        assert.equal(resp.data.registeredAddress.addressLine1, mockup.registeredAddress.addressLine1);
                        assert.equal(resp.data.registeredAddress.addressStreet, mockup.registeredAddress.addressStreet);
                        assert.equal(resp.data.registeredAddress.addressSubDistrict, mockup.registeredAddress.addressSubDistrict);
                        assert.equal(resp.data.registeredAddress.addressDistrict, mockup.registeredAddress.addressDistrict);
                        assert.equal(resp.data.registeredAddress.addressProvince, mockup.registeredAddress.addressProvince);
                        assert.equal(resp.data.registeredAddress.addressCountry, mockup.registeredAddress.addressCountry);
                        assert.equal(resp.data.registeredAddress.addressPostalCode, mockup.registeredAddress.addressPostalCode);
                        assert.equal(resp.data.registeredAddress.latitude, mockup.registeredAddress.latitude);
                        assert.equal(resp.data.registeredAddress.longitude, mockup.registeredAddress.longitude);

                        assert.equal(resp.data.contactUseRegAddress, mockup.contactUseRegAddress);

                        assert.equal(resp.data.contactAddress.addressLine1, mockup.contactAddress.addressLine1);
                        assert.equal(resp.data.registeredAddress.addressStreet, mockup.registeredAddress.addressStreet);
                        assert.equal(resp.data.contactAddress.addressSubDistrict, mockup.contactAddress.addressSubDistrict);
                        assert.equal(resp.data.contactAddress.addressDistrict, mockup.contactAddress.addressDistrict);
                        assert.equal(resp.data.contactAddress.addressProvince, mockup.contactAddress.addressProvince);
                        assert.equal(resp.data.contactAddress.addressCountry, mockup.contactAddress.addressCountry);
                        assert.equal(resp.data.contactAddress.addressPostalCode, mockup.contactAddress.addressPostalCode);
                        assert.equal(resp.data.contactAddress.latitude, mockup.contactAddress.latitude);
                        assert.equal(resp.data.contactAddress.longitude, mockup.contactAddress.longitude);

                        assert.equal(resp.data.ipIPRelationship[0].involedPartyID, mockup.ipIPRelationship[0].involedPartyID);
                        assert.equal(resp.data.ipIPRelationship[0].ipRelationshipType, mockup.ipIPRelationship[0].ipRelationshipType);

                        assert.equal(resp.data.businessTermAndCondition.paymentTerm, mockup.businessTermAndCondition.paymentTerm);
                        assert.equal(resp.data.businessTermAndCondition.creditLimit, mockup.businessTermAndCondition.creditLimit);
                        assert.equal(resp.data.businessTermAndCondition.creditOnHold, mockup.businessTermAndCondition.creditOnHold);
                        assert.equal(resp.data.businessTermAndCondition.onHoldDescription, mockup.businessTermAndCondition.onHoldDescription);
                        assert.equal(resp.data.businessTermAndCondition.grade, mockup.businessTermAndCondition.grade);

                        assert.equal(resp.data.membership[0].activity, mockup.membership[0].activity);
                        assert.equal(resp.data.membership[0].memberReference, mockup.membership[0].memberReference);

                        assert.equal(resp.data.recordInfo.createBy, mockup.recordInfo.createBy);
                        assert.equal(resp.data.recordInfo.createDate, mockup.recordInfo.createDate);
                        assert.equal(resp.data.recordInfo.updateBy, mockup.recordInfo.updateBy);
                        assert.equal(resp.data.recordInfo.updateDate, mockup.recordInfo.updateDate);
                        done();
                    });
            });

    });

    it('should be involvedparty delete use token', function (done) {

        request(app)
            .post('/api/involvedpartys')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/involvedpartys/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be involvedparty get not use token', (done) => {
        request(app)
            .get('/api/involvedpartys')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    xit('should be involvedparty post not use token', function (done) {

        request(app)
            .post('/api/involvedpartys')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be involvedparty put not use token', function (done) {

        request(app)
            .post('/api/involvedpartys')
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
                    .put('/api/involvedpartys/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be involvedparty delete not use token', function (done) {

        request(app)
            .post('/api/involvedpartys')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/involvedpartys/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Involvedparty.deleteMany().exec(done);
    });

});