import("mocha");
import config from "config";
import chai from "chai";
import chaiaspromised from "chai-as-promised";
import sinon from "sinon";

import TransactionFund from "../../../services/transaction/TransactionFund";
import TransactionRepository from "../../../services/transaction/KnexTransactionRepository";
import WalletService from "../../../services/wallet/WalletEntry";
import PaystackService from "../../../services/PaystackService";

import Wallet from "../../../services/wallet/Wallet";
import Transaction from "../../../services/transaction/Transaction";
import FakePaystackVeificationResponse from "./FakePaystackVeificationResponse";

const { expect } = chai;

chai.use(chaiaspromised);

const APP_BASE_URL = config.get("app.baseURL");

describe("TransactionFund", function() {
  describe("initializeTransactionFund", function() {
    /**
     * assertain that:
     * a new transaction is created and saved
     * the genrated link is unique to user and transaction
     */
    it("should invoke initializeTransactionFund method", async function() {
      this.timeout(0);
      const transactionRepository = new TransactionRepository();
      const walletService = new WalletService();
      const paystackService = new PaystackService();

      const transactionFund = new TransactionFund(
        transactionRepository,
        walletService,
        paystackService
      );

      const walletData = {
        id: "e327df07-db8e-455c-8d37-01cef7d56ade",
        balance: 575750000, // why did I put this much in my wallet?. Because I affirm It!
        name: "Oluwaniyii Ayodele",
        email: "ayodeleyniyii@gmail.com"
      };
      const transactionId = "f327df07-db8e-455c-8d37-01cef7d56adf";

      const getWallet = sinon.stub(walletService, "getWallet").resolves({
        wallet: new Wallet(walletData.id, walletData.balance, walletData.name, walletData.email)
      });
      const createTransaction = sinon
        .stub(transactionRepository, "createTransaction")
        .callsFake(function({
          transaction_type,
          amount,
          status,
          initiator_bank,
          initiator_name,
          initiator_account
        }) {
          const transaction = new Transaction();

          transaction.id = transactionId;
          transaction.transactionType = transaction_type;
          transaction.amount = amount;
          transaction.status = status;
          transaction.initiator_name = initiator_name;
          transaction.initiator_bank = initiator_bank;
          transaction.initiator_account = initiator_account;
          transaction.created_at = new Date().toISOString();

          return Promise.resolve(transaction);
        });

      transactionFund.setWalletId(walletData.id);
      const action = await transactionFund.initializeFund();
      const PotentialPaymentLink = `${APP_BASE_URL}/pg/transaction/fund?ref=tr_${transactionId}&email=${walletData.email}`;

      sinon.assert.calledOnceWithMatch(createTransaction, {
        transaction_type: "FUND",
        initiator_name: walletData.name,
        initiator_account: walletData.id
      });
      expect(action).to.have.property("paymentLink", PotentialPaymentLink);

      getWallet.restore();
      createTransaction.restore();
    });
  });

  describe("completeTransactionFund", function() {
    /**
     * assertain that:
     * loads the transaction
     * verifies the transaction status from paystack
     * updates transaction in db
     * return response
     */

    describe("transaction::Success", function() {
      /**
       * assertain that:
       *  verifies transaction success behaviour:
       *    it should credit account wallet
       *    update transaction data
       *    return transaction class as response
       */
      it("transaction::Success", async function() {
        this.timeout(0);
        const transactionRepository = new TransactionRepository();
        const walletService = new WalletService();
        const paystackService = new PaystackService();
        const transactionFund = new TransactionFund(
          transactionRepository,
          walletService,
          paystackService
        );

        const transaction_id = "f327df07-db8e-455c-8d37-01cef7d56adf";
        const transactionData = {
          id: "f327df07-db8e-455c-8d37-01cef7d56adf",
          transaction_type: "FUND",
          status: "pending",
          amount: undefined,
          initiator_name: "Oluwaniyii Ayodele",
          initiator_bank: "democredit",
          initiator_account: "e327df07-db8e-455c-8d37-01cef7d56ade",
          created_at: new Date().toISOString()
        };
        const walletData = {
          id: "e327df07-db8e-455c-8d37-01cef7d56ade",
          balance: 575750000,
          name: "Oluwaniyii Ayodele",
          email: "ayodeleyniyii@gmail.com"
        };

        const getWallet = sinon.stub(walletService, "getWallet").resolves({
          wallet: new Wallet(walletData.id, walletData.balance, walletData.name, walletData.email)
        });
        const getTransaction = sinon
          .stub(transactionRepository, "getTransaction")
          .callsFake(function(transaction_id) {
            return Promise.resolve(transactionData);
          });

        const deposit = sinon.stub(walletService, "deposit").callsFake(function(wallet_id, amount) {
          return Promise.resolve({
            wallet: new Wallet(
              walletData.id,
              walletData.balance + amount,
              walletData.name,
              walletData.email
            )
          });
        });
        const updateTransaction = sinon.stub(transactionRepository, "updateTransaction");
        const verifyTransaction = sinon
          .stub(paystackService, "verifyTransaction")
          .resolves(FakePaystackVeificationResponse.success);

        transactionFund.setTransactionId(transaction_id);
        await transactionFund.completeFund();

        sinon.assert.calledWith(
          deposit,
          walletData.id,
          FakePaystackVeificationResponse.success.data.amount / 100
        );
        sinon.assert.calledOnceWithMatch(updateTransaction, {
          id: transaction_id,
          amount: FakePaystackVeificationResponse.success.data.amount / 100,
          status: FakePaystackVeificationResponse.success.data.status
        });

        // console.log(action);

        getTransaction.restore();
        updateTransaction.restore();
        verifyTransaction.restore();
        getWallet.restore();
        deposit.restore();
      });
    });

    describe("transaction::Failed", function() {
      /**
       * assertain that:
       *  verifies transaction failure behaviour:
       *    it should NOT credit account wallet
       *    update transaction data
       *    return transaction class as response
       * */
      it("transaction::Failed", async function() {
        this.timeout(0);
        const transactionRepository = new TransactionRepository();
        const walletService = new WalletService();
        const paystackService = new PaystackService();
        const transactionFund = new TransactionFund(
          transactionRepository,
          walletService,
          paystackService
        );

        const transaction_id = "f327df07-db8e-455c-8d37-01cef7d56adf";
        const transactionData = {
          id: "f327df07-db8e-455c-8d37-01cef7d56adf",
          transaction_type: "FUND",
          status: "pending",
          amount: undefined,
          initiator_name: "Oluwaniyii Ayodele",
          initiator_bank: "democredit",
          initiator_account: "e327df07-db8e-455c-8d37-01cef7d56ade",
          created_at: new Date().toISOString()
        };
        const walletData = {
          id: "e327df07-db8e-455c-8d37-01cef7d56ade",
          balance: 575750000, // why did I put this much in my wallet?. Because I affirm It!
          name: "Oluwaniyii Ayodele",
          email: "ayodeleyniyii@gmail.com"
        };

        const getWallet = sinon.stub(walletService, "getWallet").resolves({
          wallet: new Wallet(walletData.id, walletData.balance, walletData.name, walletData.email)
        });
        const getTransaction = sinon
          .stub(transactionRepository, "getTransaction")
          .callsFake(function(transaction_id) {
            const transaction = new Transaction();

            transaction.id = transaction_id;
            transaction.transactionType = transactionData.transaction_type;
            transaction.status = transactionData.status;
            transaction.created_at = transactionData.created_at;

            return Promise.resolve(transaction);
          });

        const deposit = sinon.stub(walletService, "deposit");
        const updateTransaction = sinon.stub(transactionRepository, "updateTransaction");
        const verifyTransaction = sinon
          .stub(paystackService, "verifyTransaction")
          .resolves(FakePaystackVeificationResponse.failure);

        transactionFund.setTransactionId(transaction_id);
        const action = await transactionFund.completeFund();

        sinon.assert.notCalled(deposit);
        sinon.assert.calledOnceWithMatch(updateTransaction, {
          id: transaction_id,
          amount: FakePaystackVeificationResponse.failure.data.amount / 100,
          status: FakePaystackVeificationResponse.failure.data.status
        });

        // console.log(action);

        getTransaction.restore();
        updateTransaction.restore();
        verifyTransaction.restore();
        getWallet.restore();
        deposit.restore();
      });
    });
  });
});
