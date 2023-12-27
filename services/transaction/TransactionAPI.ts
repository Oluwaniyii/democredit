import { Router } from "express";
import TransactionController from "./TransactionController";

const router: Router = Router();

router.post("/fund", TransactionController.initializeTransactionFund);
router.post("/fund/complete", TransactionController.completeTransactionFund);

export default router;
