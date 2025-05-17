import("mocha");
import chai from "chai";
import chaiaspromised from "chai-as-promised";
import sinon from "sinon";
import AccountRepository from "../../../services/auth/KnexAccountRepository";

const { expect } = chai;

chai.use(chaiaspromised);

describe.skip("AccountRepository", function() {
  describe("emailExists", function() {
    it("should return true if user with provided email exists", async function() {
      this.timeout(0);

      const findOne = sinon.stub(MailModel, "findOne").returns({
        user_id: "1",
        email: "johndoe@gmail.com"
      });
      const action = await AccountRepository.emailExists("johndoe@gmail.com");

      expect(action).to.be.true;
      findOne.restore();
    });
    it("should return false if there is no user with provided email", async function() {
      this.timeout(0);
      const findOne = sinon.stub(MailModel, "findOne").returns(null);
      const action = await AccountRepository.emailExists("johndoe@gmail.com");

      expect(action).to.be.false;
      findOne.restore();
    });
  });

  describe("createUser", function() {
    it("should call UserModel.create only once with firstname and lastname", async function() {
      this.timeout(0);

      const userModelCreate = sinon
        .stub(UserModel, "create")
        .callsFake(({ firstname, lastname }) => ({ id: "2bce1d3f", firstname, lastname }));

      const passwordModelCreate = sinon
        .stub(PasswordModel, "create")
        .callsFake(({ password }) => ({ password }));

      const mailModelCreate = sinon.stub(MailModel, "create").callsFake(({ mail }) => ({ mail }));

      const phoneModelCreate = sinon
        .stub(PhoneModel, "create")
        .callsFake(({ phone }) => ({ phone }));

      const data = {
        firstname: "john",
        lastname: "doe",
        email: "johndoe@gmail.com",
        phone: "1112223344",
        password: "12345678"
      };

      await AccountRepository.createAccount(
        data.firstname,
        data.lastname,
        data.email,
        data.phone,
        data.password
      );

      sinon.assert.calledOnceWithExactly(userModelCreate, {
        firstname: data.firstname,
        lastname: data.lastname
      });

      userModelCreate.restore();
      passwordModelCreate.restore();
      mailModelCreate.restore();
      phoneModelCreate.restore();
    });

    it("should also create related entries for user", async function() {
      this.timeout(0);
      const userModelCreate = sinon
        .stub(UserModel, "create")
        .callsFake(({ firstname, lastname }) => ({ id: "2bce1d3f", firstname, lastname }));

      const passwordModelCreate = sinon
        .stub(PasswordModel, "create")
        .callsFake(({ password }) => ({ password }));

      const mailModelCreate = sinon.stub(MailModel, "create").callsFake(({ mail }) => ({ mail }));

      const phoneModelCreate = sinon
        .stub(PhoneModel, "create")
        .callsFake(({ phone }) => ({ phone }));

      const data = {
        firstname: "john",
        lastname: "doe",
        email: "johndoe@gmail.com",
        phone: "1112223344",
        password: "12345678"
      };

      await AccountRepository.createAccount(
        data.firstname,
        data.lastname,
        data.email,
        data.phone,
        data.password
      );

      sinon.assert.calledOnceWithExactly(userModelCreate, {
        firstname: data.firstname,
        lastname: data.lastname
      });

      sinon.assert.calledOnceWithMatch(mailModelCreate, {
        mail: data.email
      });
      sinon.assert.calledOnceWithMatch(phoneModelCreate, {
        phone: data.phone
      });

      sinon.assert.calledOnceWithMatch(passwordModelCreate, {
        password: data.password
      });

      userModelCreate.restore();
      passwordModelCreate.restore();
      mailModelCreate.restore();
      phoneModelCreate.restore();
    });
  });
});
