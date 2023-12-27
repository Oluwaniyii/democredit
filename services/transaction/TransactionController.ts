import { Request, Response, NextFunction } from "express";
import TransactionFund from "./TransactionFund";
import TransactionRepository from "./TransactionRepository";
import WalletService from "../wallet/WalletService";
import PaystackService from "../PaystackService";
import TransactionResponseFormat from "./TransactionResponseFormat";
import TransactionWallet2Wallet from "./TransactionWallet2Wallet";

const transactionRepository = new TransactionRepository();
const walletService = new WalletService();
const paystackService = new PaystackService();

class TransactionController {
  public static async initializeTransactionFund(req: Request, res: Response, next: NextFunction) {
    try {
      const { wallet_id } = res.locals.authenticated_user;
      const transactionFund = new TransactionFund(
        transactionRepository,
        walletService,
        paystackService
      );
      transactionFund.setWalletId(wallet_id);
      const action = await transactionFund.initializeFund();
      return TransactionResponseFormat.initializeFund(res, action);
    } catch (e) {
      next(e);
    }
  }

  public static async completeTransactionFund(req: Request, res: Response, next: NextFunction) {
    try {
      const { ref: transaction_reference } = req.body;
      const transactionFund = new TransactionFund(
        transactionRepository,
        walletService,
        paystackService
      );
      transactionFund.setTransactionId(transaction_reference.replace("tr_", ""));
      const action = await transactionFund.completeFund();
      return TransactionResponseFormat.completeFund(res, action);
    } catch (e) {
      next(e);
    }
  }

  public static async transactionWallet2Wallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { wallet_id } = res.locals.authenticated_user;
      const { receiver_wallet_id, amount } = req.body;

      const transactionWallet2Wallet = new TransactionWallet2Wallet(
        transactionRepository,
        walletService
      );
      transactionWallet2Wallet.setAmount(amount || 200);
      transactionWallet2Wallet.setInitiatorWallet(wallet_id);
      transactionWallet2Wallet.setReceivingWallet(receiver_wallet_id);

      const action = await transactionWallet2Wallet.initialize();
      return TransactionResponseFormat.wallet2wallet(res, action);
    } catch (e) {
      next(e);
    }
  }
}

export default TransactionController;
