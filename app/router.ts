import { Request, Response, NextFunction } from "express";
import authAPI from "../services/auth/authApi";
import WalletAPI from "../services/wallet/WalletAPI";
import transaction_api from "../services/transaction/transaction_api";

const router = require("express").Router();

router.get("/", function(req: Request, res: Response, next: NextFunction) {
  res.json(res.locals.authenticated_user);
});
router.get("/error", function(req: Request, res: Response, next: NextFunction) {
  throw new Error("Server ran into an error"); // error test route
});

// Service routes
router.use("/accounts", authAPI);
router.use("/wallets", WalletAPI);
router.use("/transactions", transaction_api);

// view pages
router.get("/pg/transaction/fund", (req: Request, res: Response) => {
  res.render("payment");
});

export default router;
