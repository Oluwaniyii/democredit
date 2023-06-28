import { Router } from "express";
import { initializeTransactionFund, completeTransactionFund } from "./TransactionController";

const router: Router = Router();

router.post("/fund", initializeTransactionFund);
router.post("/fund/complete", completeTransactionFund);

export default router;
