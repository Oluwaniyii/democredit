"use strict";

const winston = require("../../app/utils/logger/winston");
const mocha = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");

const {
  exitProcess,
  uncaughtExceptionHandler,
  errorDecorator,
  finalErrorHandler,
  unhandledRejectionHandler
} = require("../../app/utils/errorMiddleware.js");

describe.skip("Helper functions  from errorMiddleware", function() {
  describe("Function exitProcess", function() {
    it('when called should exit process with "1" as argument', function() {
      const exit = sinon.stub(process, "exit");
      exitProcess();

      sinon.assert.calledWith(exit, 1);
      exit.restore();
    });
  });

  describe("Function unhandledRejectionHandler", function() {
    it('should call "winston.error" with "reason", "message" and "p" arguments', function() {
      const error = sinon.stub(winston, "error");
      const reason = new Error("");
      const p = {};
      unhandledRejectionHandler(reason, p);

      sinon.assert.calledWithExactly(error, {
        reason,
        message: "Unhandled Rejection at Promise",
        p
      });
      error.restore();
    });
  });

  describe("Function uncaughtExceptionHandler", function() {
    it('should call "winston.error" with "err" as an argument', function() {
      const error = sinon.stub(winston, "error");
      const exit = sinon.stub(process, "exit");
      const err = new Error("Error");
      uncaughtExceptionHandler(err);

      sinon.assert.calledWith(error, err);
      error.restore();
      exit.restore();
    });

    it('should exit process with "1" as argument', function() {
      const exit = sinon.stub(process, "exit");
      const error = sinon.stub(winston, "error");
      const err = new Error("Error");
      uncaughtExceptionHandler(err);

      sinon.assert.calledWith(exit, 1);
      error.restore();
      exit.restore();
    });
  });

  describe("Function errorDecorator", function() {
    const req = {
      originalUrl: "https://www.test.com",
      method: "GET",
      ip: "127.0.0.1"
    };

    describe("Value for 'err.isDeveloperError' property", function() {
      const res = { headersSent: false };

      describe("If already defined on error object", function() {
        const err = new Error("Some error");
        const next = sinon.stub();

        it('should not change if set to "true"', function() {
          err.isDeveloperError = true;
          errorDecorator(err, req, res, next);

          sinon.assert.calledWith(next, sinon.match({ isDeveloperError: true }));
        });

        it('should not change if set to "false"', function() {
          err.isDeveloperError = false;
          errorDecorator(err, req, res, next);

          sinon.assert.calledWith(next, sinon.match({ isDeveloperError: false }));
        });
      });

      describe("If not defined on error object", function() {
        describe("And status code does not exists", function() {
          const err = new Error("Some error");
          err.statusCode = null;
          const next = sinon.stub();
          errorDecorator(err, req, res, next);

          it('should set "err.isDeveloperError" value to "true"', function() {
            sinon.assert.calledWith(next, sinon.match({ isDeveloperError: true }));
          });
        });

        describe("And status code is >= 500 and stack trace is available", function() {
          const err = new Error("Some error");
          err.statusCode = 500;
          const next = sinon.stub();
          errorDecorator(err, req, res, next);

          it("should set 'err.isDeveloperError' value to 'true'", function() {
            sinon.assert.calledWith(next, sinon.match({ isDeveloperError: true }));
          });
        });

        describe("And status code is >=500 and stack trace is not available", function() {
          const err = new Error("Some error");
          err.statusCode = 500;
          delete err.stack;
          const next = sinon.stub();
          errorDecorator(err, req, res, next);

          it('should set "err.isDeveloperError" value to "false"', function() {
            sinon.assert.calledWith(next, sinon.match({ isDeveloperError: false }));
          });
        });
      });

      describe("And stack trace is available and status code is <500", function() {
        const err = new Error("Some error");
        err.statusCode = 400;
        const next = sinon.stub();
        errorDecorator(err, req, res, next);

        it('should set "err.isDeveloperError" value to "false"', function() {
          sinon.assert.calledWith(next, sinon.match({ isDeveloperError: false }));
        });
      });
    });

    describe("When decorating", function() {
      const err = new Error("Some error");
      const res = { headersSent: false };
      const next = sinon.stub();
      errorDecorator(err, req, res, next);

      it('should add "originalUrl" prop', function() {
        sinon.assert.calledWith(next, sinon.match({ originalUrl: req.originalUrl }));
      });

      it('should add "method" prop', function() {
        sinon.assert.calledWith(next, sinon.match({ method: req.method }));
      });

      it('should add "ip" prop', function() {
        sinon.assert.calledWith(next, sinon.match({ ip: req.ip }));
      });
    });
  });

  describe("Function finalErrorHandler", function() {
    describe('When "headersSent" is "true"', function() {
      const err = new Error("Some error");
      const res = { headersSent: true };

      it("should call next() with error object", function() {
        const next = sinon.stub();
        finalErrorHandler(err, {}, res, next);

        sinon.assert.calledWith(next, err);
      });

      it('should return with function "next()" with error object. No code execution after "if (res.headersSent) return next(err);"', function() {
        const next = sinon.stub().callsFake(function(error) {
          return error;
        });

        expect(finalErrorHandler(err, {}, res, next)).to.be.equal(err);
      });
    });

    describe("When it is a developer error and not a server error", function() {
      const res = {
        headersSent: false,
        json() {},
        status() {
          return this;
        }
      };

      it('should call "winston.error" with "err" as an argument', function() {
        const err = new Error("Some error");
        err.isDeveloperError = true;
        err.isServer = false;
        const error = sinon.stub(winston, "error");
        const exit = sinon.stub(process, "exit");
        finalErrorHandler(err, {}, res, {});

        sinon.assert.calledWith(error, err);
        error.restore();
        exit.restore();
      });

      it("should call process.exit with exit code 1", function() {
        const err = new Error("Some error");
        err.isDeveloperError = true;
        err.isServer = false;
        const error = sinon.stub(winston, "error");
        const exit = sinon.stub(process, "exit");
        finalErrorHandler(err, {}, res, {});

        sinon.assert.calledWith(exit, 1);
        exit.restore();
        error.restore();
      });
    });
  });
});
