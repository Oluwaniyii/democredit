import("mocha");
import { expect } from "chai";
import sinon from "sinon";
import chai from "chai";
import chaiaspromised from "chai-as-promised";
import AccountLogin from "../../../services/auth/AccountLogin";
import AccountRepository from "../../../services/auth/KnexAccountRepository";
import AppException from "../../../services/AppException";
import Bcrypt from "../../../libraries/bcrypt";
import UUID from "../../../libraries/uuid";
import Account from "../../../services/auth/Account";

chai.use(chaiaspromised);

describe("AccountLogin", function() {
  describe("should throw Error for wrong credentials", function() {
    it("should throw Error when email does not exist", function() {
      const data = {
        email: "emaildoesnotexist@gmail.com",
        password: "John1234"
      };

      const accountRepository = new AccountRepository();
      const accountLogin = new AccountLogin(accountRepository, UUID);
      const emailExists = sinon.stub(accountRepository, "emailExists").resolves(false);
      const compare = sinon.stub(Bcrypt, "compare").resolves(true);

      accountLogin.setEmail(data.email);
      accountLogin.setPassword(data.password);

      const action = accountLogin.init();

      return expect(action).to.be.rejected.then(function(error) {
        expect(error).to.be.an.instanceof(AppException);
        expect(error).to.have.property("errorCode", 1101);
        expect(error).to.have.property("statusCode", 401);

        emailExists.restore();
        compare.restore();
      });
    });
  });

  // disabled action
  describe.skip("should create a login session for user if login details is right", function() {
    it("should return newly created user session data", async function() {
      this.timeout(0);

      const input = {
        email: "johndoe@gmail.com",
        password: "hashedjohn123"
      };

      const accountData = {
        id: "2ebcda1",
        email: "john@gmail.com",
        name: "john doe",
        password: "hashedjohn123",
        phone: "1112223344",
        created_at: new Date().toISOString()
      };

      const accountRepository = new AccountRepository();
      const accountLogin = new AccountLogin(accountRepository, UUID);

      const emailExists = sinon.stub(accountRepository, "emailExists").resolves(true);

      const getAccountByEmail = sinon
        .stub(accountRepository, "getAccountByEmail")
        .resolves(
          new Account(
            accountData.id,
            accountData.name,
            accountData.email,
            accountData.phone,
            accountData.password,
            accountData.created_at
          )
        );

      accountLogin.setEmail(input.email);
      accountLogin.setPassword(input.password);
      const action = await accountLogin.init();

      return expect(action).to.be.fulfilled.then(function(data) {
        expect(data).to.be.an("object");
        expect(data).to.have.property("session");
        expect(data.session).to.be.an("object");

        emailExists.restore();
        getAccountByEmail.restore();
      });
    });
  });
});
