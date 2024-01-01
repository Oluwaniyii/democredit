import { Request, Response, NextFunction } from "express";
import jwt from "../libraries/jwt";
import AppException from "../services/AppException";
import { domainError } from "../services/domainError";
import AccountAPI from "../services/auth/AccountAPI";
import WalletAPI from "../services/wallet/WalletAPI";
import TransactionAPI from "../services/transaction/TransactionAPI";
import SupportAPI from "../services/support/SupportAPI";

const router = require("express").Router();

router.use("/accounts", AccountAPI);
router.use("/wallets", WalletAPI);
router.use("/transactions", TransactionAPI);
router.use("/support", SupportAPI);

router.get("/pg/transaction/fund", (req: Request, res: Response) => {
  res.render("payment");
});

router.get("/", function(req: Request, res: Response, next: NextFunction) {
  res.send("Welcome to Democredit API");
});

router.get("/error", function(req: Request, res: Response, next: NextFunction) {
  throw new Error("Server ran into an error");
});

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
