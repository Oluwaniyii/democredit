import("mocha");
import config from "config";
import chai from "chai";
import chaiaspromised from "chai-as-promised";
import sinon from "sinon";

import TransactionTransfer from "../../../services/transaction/TransactionWallet2Other";
import TransactionRepository from "../../../services/transaction/KnexTransactionRepository";
import WalletService from "../../../services/wallet/WalletService";

import Wallet from "../../../services/wallet/Wallet";

const { expect } = chai;

chai.use(chaiaspromised);

/**
 * deducts amount from sender wallet
 * adds amount to receiver wallet
 * save transaction to database
 * return response
 */
describe("TransactionTransfer", function() {
  describe("initialize", function() {
    it("", async function() {
      this.timeout(0);
      const transactionRepository = new TransactionRepository();
      const walletService = new WalletService();
      const transactionTransfer = new TransactionTransfer(transactionRepository, walletService);

      const AMOUNT_TO_TRANSFER = 250;
      const wallets = [
        {
          id: "e327df07-db8e-455c-8d37-01cef7d56ade",
          balance: 2500,
          name: "Oluwaniyii Ayodele",
          email: "ayodeleyniyii@gmail.com"
        },
        {
          id: "48113d65-b526-48cd-8337-c1842d0e6ccb",
          balance: 300,
          name: "Oluwadamilola Ayodele",
          email: "ayodeledami@gmail.com"
        }
      ];

      const getWallet = sinon
        .stub(walletService, "getWallet")
        .callsFake(function(wallet_id: string) {
          let walletData;
          let wallet;

          for (let i = 0; i < wallets.length; i++) {
            if (wallets[i].id === wallet_id) {
              walletData = wallets[i];

              wallet = new Wallet(
                walletData.id,
                walletData.balance,
                walletData.name,
                walletData.email
              );
            }
          }

          return Promise.resolve({ wallet: wallet });
        });
      const deposit = sinon.stub(walletService, "deposit").callsFake(function(wallet_id, amount) {
        let walletData;
        let wallet;

        for (let i = 0; i < wallets.length; i++) {
          if (wallets[i].id === wallet_id) {
            walletData = wallets[i];

            wallet = {
              wallet: new Wallet(
                walletData.id,
                walletData.balance + amount,
                walletData.name,
                walletData.email
              )
            };
          }
        }

        return Promise.resolve(wallet);
      });
      const withdraw = sinon.stub(walletService, "withdraw").callsFake(function(wallet_id, amount) {
        let walletData;
        let wallet;

        for (let i = 0; i < wallets.length; i++) {
          if (wallets[i].id === wallet_id) {
            walletData = wallets[i];

            wallet = {
              wallet: new Wallet(
                walletData.id,
                walletData.balance - amount,
                walletData.name,
                walletData.email
              )
            };
          }
        }

        return Promise.resolve(wallet);
      });
      const createTransfer = sinon.stub(transactionRepository, "createTransfer").resolves({
        transaction_id: "1b2e3cdf4",
        created_at: new Date()
      });

      const INITIATOR_WALLET = wallets[0];
      const RECEIVER_WALLET = wallets[1];

      transactionTransfer.setInitiatorAccountNumber(INITIATOR_WALLET.id);
      transactionTransfer.setReceiverAccountNumber(RECEIVER_WALLET.id);
      transactionTransfer.setAmount(AMOUNT_TO_TRANSFER);

      const action = await transactionTransfer.initialize();

      expect(true).to.be.ok;

      sinon.assert.calledOnceWithExactly(withdraw, INITIATOR_WALLET.id, AMOUNT_TO_TRANSFER);
      sinon.assert.calledOnceWithExactly(deposit, RECEIVER_WALLET.id, AMOUNT_TO_TRANSFER);

      sinon.assert.calledWithMatch(createTransfer, {
        amount: AMOUNT_TO_TRANSFER,
        initiatingWallet: INITIATOR_WALLET.id,
        accountNumber: RECEIVER_WALLET.id,
        status: "success"
      });
      sinon.assert.calledOnce(createTransfer);

      getWallet.restore();
      deposit.restore();
      withdraw.restore();
      createTransfer.restore();
    });
  });
});
