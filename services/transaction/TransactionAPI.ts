import { Router, Request, Response, NextFunction } from "express";
import TransactionController from "./TransactionController";
import jwt from "../../libraries/jwt";
import AppException from "../../services/AppException";
import { domainError } from "../../services/domainError";

const router: Router = Router();

router.post("/fund", AuthProtectionMiddleware, TransactionController.initializeTransactionFund);
router.post("/fund/complete", TransactionController.completeTransactionFund);
router.post("/transfer", AuthProtectionMiddleware, TransactionController.transactionWallet2Wallet);
router.post("/withdraw", AuthProtectionMiddleware, TransactionController.transactionWallet2Other);

router.get("/", AuthProtectionMiddleware, TransactionController.getTransactionHistory);
router.get("/:id", AuthProtectionMiddleware, TransactionController.getTransaction);

async function AuthProtectionMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    let bearerToken = req.headers.authorization && req.headers.authorization.split("Bearer ")[1];

    if (!bearerToken)
      throw new AppException(domainError.INVALID_OR_MISSING_HEADER, "missing bearer token");

    const authenticated_user: any = await jwt.decode(bearerToken);
    res.locals.authenticated_user = authenticated_user.data;

    next();
  } catch (err) {
    next(err);
  }
}

export default router;
