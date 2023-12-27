import { Router } from "express";
import TransactionController from "./TransactionController";

const router: Router = Router();

router.post("/fund", TransactionController.initializeTransactionFund);
router.post("/fund/complete", TransactionController.completeTransactionFund);
router.post("/transfer", TransactionController.transactionWallet2Wallet);
router.post("/withdraw", TransactionController.transactionWallet2Other);

router.get("/", TransactionController.getTransactionHistory);

export default router;
