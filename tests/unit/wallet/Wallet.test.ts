import "mocha";
import config from "config";
import chai from "chai";
import chaiaspromised from "chai-as-promised";

import Wallet from "../../../services/wallet/Wallet";

const { expect } = chai;
chai.use(chaiaspromised);

describe("Wallet", function() {
  describe("setters and getters", function() {
    it("should assertain that setters and getters are working as expected", function() {
      const walletData = {
        id: "1b2c3a",
        balance: 700,
        accountName: "Hilda Bacci",
        accountEmail: "hilda@gmail.com"
      };

      const wallet = new Wallet(
        walletData.id,
        walletData.balance,
        walletData.accountName,
        walletData.accountEmail
      );

      expect(wallet.getId()).to.equal(walletData.id);
      expect(wallet.getBalance()).to.equal(walletData.balance);
      expect(wallet.getAccountName()).to.equal(walletData.accountName);
      expect(wallet.getAccountEmail()).to.equal(walletData.accountEmail);
    });
  });

  describe("withdraw", function() {
    const walletData = {
      id: "1b2c3a",
      balance: 700,
      accountName: "Hilda Bacci",
      accountEmail: "hilda@gmail.com"
    };

    const wallet = new Wallet(
      walletData.id,
      walletData.balance,
      walletData.accountName,
      walletData.accountEmail
    );

    describe("should throw an error if amount is less than 0.1", function() {
      const testCases = [{ amountToWithdraw: -20 }, { amountToWithdraw: 0 }];

      testCases.forEach(function(testCase: any, index: number) {
        it(`case ${index + 1}`, function() {
          const fn = function() {
            wallet.withdraw(testCase.amountToWithdraw);
          };

          expect(fn).to.throw("invalid amount!, amount can't be less than 0.1");
        });
      });
    });

    it("should throw an error if balance is lower than amount to withdraw", function() {
      const fn = function() {
        wallet.withdraw(750.5);
      };

      expect(fn).to.throw("insufficient funds!, balance is lower than amount requested");
    });

    it("should deduct amount from wallet if all is okay", function() {
      const amountToWithdraw = 600.5;
      wallet.withdraw(amountToWithdraw);

      expect(wallet.getBalance()).to.equal(walletData.balance - amountToWithdraw);
    });
  });

  describe("deposit", function() {
    const walletData = {
      id: "1b2c3a",
      balance: 700,
      accountName: "Hilda Bacci",
      accountEmail: "hilda@gmail.com"
    };

    const wallet = new Wallet(
      walletData.id,
      walletData.balance,
      walletData.accountName,
      walletData.accountEmail
    );

    describe("should throw an error if amount is less than 0.1", function() {
      const testCases = [{ amountToDeposit: -20 }, { amountToDeposit: 0 }];

      testCases.forEach(function(testCase: any, index: number) {
        it(`case ${index + 1}`, function() {
          const fn = function() {
            wallet.deposit(testCase.amountToDeposit);
          };

          expect(fn).to.throw("invalid amount!, amount can't be less than 0.1");
        });
      });
    });

    it("should add amount to wallet balance if all is okay", function() {
      const amountToDeposit = 200.05;
      wallet.deposit(amountToDeposit);

      expect(wallet.getBalance()).to.equal(walletData.balance + amountToDeposit);
    });
  });

  describe("serialze", function() {
    it("should return iterable data of wallet", function() {
      const walletData = {
        id: "1b2c3a",
        balance: 700,
        accountName: "Hilda Bacci",
        accountEmail: "hilda@gmail.com"
      };

      const wallet = new Wallet(
        walletData.id,
        walletData.balance,
        walletData.accountName,
        walletData.accountEmail
      );

      expect(wallet.serialize()).to.deep.equal({
        id: walletData.id,
        balance: walletData.balance,
        accountName: walletData.accountName,
        accountEmail: walletData.accountEmail
      });
    });
  });
});
