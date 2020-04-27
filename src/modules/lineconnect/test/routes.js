"use strict";
var request = require("supertest"),
  assert = require("assert"),
  config = require("../../../config/config"),
  _ = require("lodash"),
  jwt = require("jsonwebtoken"),
  mongoose = require("mongoose"),
  app = require("../../../config/express"),
  Lineconnect = mongoose.model("Lineconnect");

var credentials, token, mockup;

describe("Lineconnect CRUD routes tests", function () {
  before(function (done) {
    mockup = {
      name: "name",
    };
    credentials = {
      username: "username",
      password: "password",
      firstname: "first name",
      lastname: "last name",
      email: "test@email.com",
      roles: ["user"],
    };
    token = jwt.sign(_.omit(credentials, "password"), config.jwt.secret, {
      expiresIn: 2 * 60 * 60 * 1000,
    });
    done();
  });

  xit("should be Lineconnect get use token", (done) => {
    request(app)
      .get("/api/lineconnects")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        done();
      });
  });

  xit("should be Lineconnect get by id", function (done) {
    request(app)
      .post("/api/lineconnects")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        request(app)
          .get("/api/lineconnects/" + resp.data._id)
          .set("Authorization", "Bearer " + token)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var resp = res.body;
            assert.equal(resp.status, 200);
            assert.equal(resp.data.name, mockup.name);
            done();
          });
      });
  });

  xit("should be Lineconnect post use token", (done) => {
    request(app)
      .post("/api/lineconnects")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        assert.equal(resp.data.name, mockup.name);
        done();
      });
  });

  xit("should be lineconnect put use token", function (done) {
    request(app)
      .post("/api/lineconnects")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        var update = {
          name: "name update",
        };
        request(app)
          .put("/api/lineconnects/" + resp.data._id)
          .set("Authorization", "Bearer " + token)
          .send(update)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var resp = res.body;
            assert.equal(resp.data.name, update.name);
            done();
          });
      });
  });

  xit("should be lineconnect delete use token", function (done) {
    request(app)
      .post("/api/lineconnects")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        request(app)
          .delete("/api/lineconnects/" + resp.data._id)
          .set("Authorization", "Bearer " + token)
          .expect(200)
          .end(done);
      });
  });

  xit("should be lineconnect get not use token", (done) => {
    request(app)
      .get("/api/lineconnects")
      .expect(403)
      .expect({
        status: 403,
        message: "User is not authorized",
      })
      .end(done);
  });

  xit("should be lineconnect post not use token", function (done) {
    request(app)
      .post("/api/lineconnects")
      .send(mockup)
      .expect(403)
      .expect({
        status: 403,
        message: "User is not authorized",
      })
      .end(done);
  });

  xit("should be lineconnect put not use token", function (done) {
    request(app)
      .post("/api/lineconnects")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        var update = {
          name: "name update",
        };
        request(app)
          .put("/api/lineconnects/" + resp.data._id)
          .send(update)
          .expect(403)
          .expect({
            status: 403,
            message: "User is not authorized",
          })
          .end(done);
      });
  });

  xit("should be lineconnect delete not use token", function (done) {
    request(app)
      .post("/api/lineconnects")
      .set("Authorization", "Bearer " + token)
      .send(mockup)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        request(app)
          .delete("/api/lineconnects/" + resp.data._id)
          .expect(403)
          .expect({
            status: 403,
            message: "User is not authorized",
          })
          .end(done);
      });
  });

  afterEach(function (done) {
    Lineconnect.deleteMany().exec(done);
  });
});
