"use strict";

require("mocha");
const { expect } = require("chai");
const AuthException = require("../../../services/AppException");

describe("AuthExceptionTest", function() {
  const authException = new AppException(400, "invalid credentials");

  it("should be an instanceOf Error", function() {
    expect(authException).to.be.instanceOf(Error);
  });

  it("should have isDeveloperError property set to false", function() {
    expect(authException).to.have.property("isDeveloperError", false);
  });

  it("should have stack property set to null", function() {
    expect(authException).to.have.property("stack", null);
  });

  it("error.statusCode should return provided statusCode", function() {
    expect(authException).to.have.property("statusCode", 400);
  });

  it("error.message should return provided message", function() {
    expect(authException).to.have.property("message", "invalid credentials");
  });
});
