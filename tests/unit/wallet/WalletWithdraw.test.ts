import("mocha");
import config from "config";
import chai from "chai";
import chaiaspromised from "chai-as-promised";
import sinon from "sinon";

import WalletRepository from "../../../services/wallet/WalletRepository";
import Wallet from "../../../services/wallet/Wallet";
import WalletWithdraw from "../../../services/wallet/WalletWithdraw";

const { expect } = chai;

chai.use(chaiaspromised);

describe("WalletWithdraw", function() {
  // it should deduct amount to wallet balance
  // it should save wallet's new state
  // return new wallet state (optional)

  it("should add deposit amount to wallet balance", async function() {
    this.timeout(0);
    const walletRepository = new WalletRepository();
    const walletWithdraw = new WalletWithdraw(walletRepository);

    const walletData = {
      id: "1b2c3a",
      balance: 700,
      accountName: "Hilda Bacci",
      accountEmail: "hilda@gmail.com"
    };
    const amountToWithdraw = 200.5;

    const getWallet = sinon
      .stub(walletRepository, "getWallet")
      .resolves(
        new Wallet(
          walletData.id,
          walletData.balance,
          walletData.accountName,
          walletData.accountEmail
        )
      );
    const save = sinon.stub(walletRepository, "save");

    const wallet = new Wallet(
      walletData.id,
      walletData.balance,
      walletData.accountName,
      walletData.accountEmail
    );
    wallet.withdraw(amountToWithdraw);

    const action = await walletWithdraw.init(walletData.id, amountToWithdraw);

    sinon.assert.calledWithMatch(save, wallet);
    expect(action.wallet).to.deep.equal(wallet);

    getWallet.restore();
    save.restore();
  });
});
