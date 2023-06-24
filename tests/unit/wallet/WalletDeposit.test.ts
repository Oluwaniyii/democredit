import("mocha");
import config from "config";
import chai from "chai";
import chaiaspromised from "chai-as-promised";
import sinon from "sinon";

import WalletDeposit from "../../../services/wallet/WalletDeposit";
import WalletRepository from "../../../services/wallet/WalletRepository";
import Wallet from "../../../services/wallet/Wallet";

const { expect } = chai;

chai.use(chaiaspromised);

describe("WalletDeposit", function() {
  // it should add amount to wallet balance
  // it should save wallet's new state
  // return new wallet state (optional)

  /* 
    Hi,
    This is where I hit an OOP brick wall
    The wallet is supposed to be a private property (for protection)
    But this makes it impossible to spy if the wallet.deposit(amount) is actually called
    Another is, what should we actually focus on here, a straightforward deposit funtion with wallet_id where my balance gets increased?
    Anyways, I believe unit tests should only focus on public methods and method's overall behaviour
  */

  it("should add deposit amount to wallet balance", async function() {
    this.timeout(0);
    const walletRepository = new WalletRepository();
    const walletDeposit = new WalletDeposit(walletRepository);

    const walletData = {
      id: "1b2c3a",
      balance: 700,
      accountName: "Hilda Bacci",
      accountEmail: "hilda@gmail.com"
    };
    const amountToDeposit = 200.5;

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
    wallet.deposit(amountToDeposit);

    const action = await walletDeposit.init(walletData.id, amountToDeposit);

    sinon.assert.calledWithMatch(save, wallet);
    expect(action.wallet).to.deep.equal(wallet);

    getWallet.restore();
    save.restore();
  });
});
