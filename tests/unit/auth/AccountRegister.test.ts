import("mocha");
import chai from "chai";
import chaiaspromised from "chai-as-promised";
import sinon from "sinon";
import Account from "../../../services/auth/Account";
import AccountRegister from "../../../services/auth/AccountRegister";
import AppException from "../../../services/AppException";
import AccountRepository from "../../../services/auth/AccountRepository";
import Bcrypt from "../../../libraries/bcrypt";

const { expect } = chai;

chai.use(chaiaspromised);

describe("AccountRegister", function() {
  describe("Auth Error", function() {
    describe("should throw Error", function() {
      it("if email is taken", function() {
        this.timeout(0);

        const accountRepository = new AccountRepository();
        const accountRegister = new AccountRegister(accountRepository, Bcrypt);

        const emailExists = sinon.stub(accountRepository, "emailExists").resolves(true);
        const createAccount = sinon.stub(accountRepository, "createAccount");
        const hash = sinon.stub(Bcrypt, "hash");

        const data = {
          email: "johndoe@gmail.com",
          phone: "1112223344",
          name: "john doe",
          password: "john1234"
        };

        accountRegister.setName(data.name);
        accountRegister.setEmail(data.email);
        accountRegister.setPhone(data.phone);
        accountRegister.setPassword(data.password);

        const action = accountRegister.init();

        return expect(action).to.be.rejected.then(function(error) {
          expect(error).to.be.instanceof(AppException);
          expect(error).to.have.property("errorCode", 1103);

          emailExists.restore();
          createAccount.restore();
          hash.restore();
        });
      });
    });
  });

  describe("Create new user account", function() {
    it("should hash password before storing in database", async function() {
      this.timeout(0);

      const accountRepository = new AccountRepository();
      const accountRegister = new AccountRegister(accountRepository, Bcrypt);

      const createAccount = sinon.stub(accountRepository, "createAccount");
      const emailExists = sinon.stub(accountRepository, "emailExists").resolves(false);
      const hash = sinon.stub(Bcrypt, "hash").callsFake(function(password, saltRounds) {
        return Promise.resolve(`hashed${password}`);
      });

      const data = {
        email: "johndoe@gmail.com",
        phone: "1112223344",
        name: "john doe",
        password: "john1234"
      };

      accountRegister.setName(data.name);
      accountRegister.setEmail(data.email);
      accountRegister.setPhone(data.phone);
      accountRegister.setPassword(data.password);

      await accountRegister.init();

      sinon.assert.calledOnceWithExactly(
        createAccount,
        data.name,
        data.email,
        data.phone,
        `hashed${data.password}` // hashed password
      );

      createAccount.restore();
      emailExists.restore();
      hash.restore();
    });

    it("should edit phone before storing in database", async function() {
      this.timeout(0);

      const accountRepository = new AccountRepository();
      const accountRegister = new AccountRegister(accountRepository, Bcrypt);

      const emailExists = sinon.stub(accountRepository, "emailExists").resolves(false);
      const createAccount = sinon.stub(accountRepository, "createAccount");
      const hash = sinon.stub(Bcrypt, "hash").callsFake(function(password) {
        return Promise.resolve(password);
      });

      const data = {
        email: "johndoe@gmail.com",
        phone: "1112223344",
        name: "john doe",
        password: "john1234"
      };

      accountRegister.setName(data.name);
      accountRegister.setEmail(data.email);
      accountRegister.setPhone(data.phone);
      accountRegister.setPassword(data.password);

      await accountRegister.init();

      sinon.assert.calledWith(createAccount, data.name, data.email, data.phone, data.password);

      createAccount.restore();
      emailExists.restore();
      hash.restore();
    });

    it("should call repository.createAccount once", async function() {
      this.timeout(0);

      const accountRepository = new AccountRepository();
      const accountRegister = new AccountRegister(accountRepository, Bcrypt);

      const hash = sinon.stub(Bcrypt, "hash").callsFake(function(password) {
        return Promise.resolve(password);
      });
      const emailExists = sinon.stub(accountRepository, "emailExists").resolves(false);
      const createAccount = sinon.stub(accountRepository, "createAccount");

      const data = {
        email: "johndoe@gmail.com",
        phone: "1112223344",
        name: "john doe",
        password: "john1234"
      };

      accountRegister.setName(data.name);
      accountRegister.setEmail(data.email);
      accountRegister.setPhone(data.phone);
      accountRegister.setPassword(data.password);

      await accountRegister.init();

      sinon.assert.calledOnceWithExactly(
        createAccount,
        data.name,
        data.email,
        data.phone,
        data.password
      );

      hash.restore();
      emailExists.restore();
      createAccount.restore();
    });

    it("should return newly created user data", function() {
      this.timeout(0);
      const accountRepository = new AccountRepository();
      const accountRegister = new AccountRegister(accountRepository, Bcrypt);

      const hash = sinon.stub(Bcrypt, "hash").callsFake(function(password) {
        return Promise.resolve(password);
      });
      const emailExists = sinon.stub(accountRepository, "emailExists").resolves(false);
      const createAccount = sinon
        .stub(accountRepository, "createAccount")
        .callsFake(function(name, email, phone, password) {
          const account = new Account(
            "1b23cdfe5",
            name,
            email,
            phone,
            password,
            new Date().toISOString()
          );

          return Promise.resolve(account);
        });

      const data = {
        email: "johndoe@gmail.com",
        phone: "1112223344",
        name: "john doe",
        password: "john1234"
      };

      accountRegister.setName(data.name);
      accountRegister.setEmail(data.email);
      accountRegister.setPhone(data.phone);
      accountRegister.setPassword(data.password);

      const action = accountRegister.init();

      return expect(action).to.be.fulfilled.then(function(data) {
        const account = data.account;

        expect(account).to.be.an("object");
        expect(account).to.have.property("id");
        expect(account).to.have.property("name", account.name);
        expect(account).to.have.property("email", account.email);
        expect(account).to.have.property("phone", account.phone);

        hash.restore();
        emailExists.restore();
        createAccount.restore();
      });
    });
  });
});
