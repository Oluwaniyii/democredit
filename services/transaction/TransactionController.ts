import { Request, Response, NextFunction } from "express";
import TransactionFund from "./TransactionFund";
import TransactionRepository from "./TransactionRepository";
import WalletService from "../wallet/WalletService";
import PaystackService from "../PaystackService";
import TransactionResponseFormat from "./TransactionResponseFormat";
import TransactionWallet2Wallet from "./TransactionWallet2Wallet";
import TransactionWallet2Other from "./TransactionWallet2Other";
import TransactionViewMany from "./TransactionViewMany";
import TransactionView from "./TransactionView";
import TransactionValidation from "./TransactionValidation";

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
      const { ref: transaction_reference } = await TransactionValidation.completeFund(req.body);

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
      const { receiver_wallet_id, amount } = await TransactionValidation.wallet2Wallet(req.body);

      console.log(req.body);

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

  public static async transactionWallet2Other(req: Request, res: Response, next: NextFunction) {
    try {
      const { wallet_id, id } = res.locals.authenticated_user;
      const { amount, bank_code, account_number } = await TransactionValidation.wallet2Other(
        req.body
      );

      const transactionWallet2Other = new TransactionWallet2Other(
        transactionRepository,
        walletService,
        paystackService
      );

      transactionWallet2Other.setUserId(id);
      transactionWallet2Other.setWalletId(wallet_id);
      transactionWallet2Other.setAmount(amount || 200);
      transactionWallet2Other.setBankCode(bank_code);
      transactionWallet2Other.setAccountNumber(account_number);

      const action = await transactionWallet2Other.init();
      return TransactionResponseFormat.wallet2other(res, action);
    } catch (e) {
      next(e);
    }
  }

  public static async getTransactionHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { wallet_id } = res.locals.authenticated_user;
      const { limit, page } = req.query;

      const transactionViewMany = new TransactionViewMany(transactionRepository);
      transactionViewMany.setWalletId(wallet_id);
      transactionViewMany.setLimit(limit);
      transactionViewMany.setPage(page);

      const action = await transactionViewMany.init();
      return TransactionResponseFormat.getTransactionHistory(res, action);
    } catch (e) {
      next(e);
    }
  }

  public static async getTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: transactionId } = req.params;

      const transactionView = new TransactionView(transactionRepository, walletService);
      transactionView.setTransactionId(transactionId);

      const action = await transactionView.init();
      return TransactionResponseFormat.getTransaction(res, action);
    } catch (e) {
      next(e);
    }
  }
}

export default TransactionController;
