import("mocha");
import chai, { expect } from "chai";
import chaiaspromised from "chai-as-promised";
import sinon from "sinon";
import AccountView from "../../../services/auth/AccountView";
import AccountRepository from "../../../services/auth/AccountRepository";
import Account from "../../../services/auth/Account";
import AppException from "../../../services/AppException";

chai.use(chaiaspromised);

describe.skip("AccountView", function() {
  describe("init", function() {
    it("should throw Account not found error if user does not exist", async function() {
      const accountRepository = new AccountRepository();
      const accountView = new AccountView(accountRepository);
      const getAccountById = sinon.stub(accountRepository, "getAccountById").resolves(null);

      const accountId = "1d2bce23d2";

      accountView.setAccountId(accountId);
      const action = accountView.init();

      return expect(action).to.be.rejected.then(function(error) {
        expect(error).to.be.instanceOf(AppException);
        expect(error).to.have.property(
          "message",
          `account with the id ${accountId} does not exist`
        );

        getAccountById.restore();
      });
    });

    it("should return user data if user does exist", async function() {
      const accountRepository = new AccountRepository();
      const accountView = new AccountView(accountRepository);

      const getAccountById = sinon
        .stub(accountRepository, "getAccountById")
        .callsFake(function(accountId) {
          const userData = {
            id: "1d2bce23d2",
            name: "John Smith",
            email: "john@gmail.com",
            phone: "1112223344",
            password: "john123",
            created_at: new Date("06-03-2023").toDateString()
          };

          const account = new Account(
            userData.id,
            userData.name,
            userData.email,
            userData.phone,
            userData.password,
            userData.created_at
          );

          return Promise.resolve(account);
        });

      const accountId = "1d2bce23d2";
      accountView.setAccountId(accountId);
      const { account } = await accountView.init();

      expect(account).to.be.instanceOf(Account);
      expect(account).to.have.property("id", accountId);
      expect(account).to.have.property("name");
      expect(account).to.have.property("email");
      expect(account).to.have.property("phone");
      expect(account).to.have.property("created_at");

      getAccountById.restore();
    });
  });
});
