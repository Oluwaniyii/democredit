import { Router } from "express";
import {
  initializeTransactionFund,
  completeTransactionFund,
  transactionWallet2Wallet
} from "./TransactionController";

const router: Router = Router();

router.post("/fund", initializeTransactionFund);
router.post("/fund/complete", completeTransactionFund);
router.post("/transfer", transactionWallet2Wallet);

export default router;
