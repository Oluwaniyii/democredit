import { Request, Response, NextFunction } from "express";
import TransactionFund from "./TransactionFund";
import TransactionRepository from "./KnexTransactionRepository";
import WalletService from "../wallet/WalletEntry";
import PaystackService from "../PaystackService";
import TransactionResponseFormat from "./TransactionResponseFormat";

const transactionRepository = new TransactionRepository();
const walletService = new WalletService();
const paystackService = new PaystackService();

export async function initializeTransactionFund(req: Request, res: Response, next: NextFunction) {
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

export async function completeTransactionFund(req: Request, res: Response, next: NextFunction) {
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
