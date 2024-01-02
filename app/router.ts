import { Request, Response, NextFunction } from "express";
import jwt from "../libraries/jwt";
import AppException from "../services/AppException";
import { domainError } from "../services/domainError";
import AccountAPI from "../services/auth/AccountAPI";
import WalletAPI from "../services/wallet/WalletAPI";
import TransactionAPI from "../services/transaction/TransactionAPI";
import SupportAPI from "../services/support/SupportAPI";
import config from "config";

const router = require("express").Router();

router.use("/accounts", AccountAPI);
router.use("/wallets", WalletAPI);
router.use("/transactions", TransactionAPI);
router.use("/support", SupportAPI);

console.log(config.get("paystack.secret"));
console.log(config.get("paystack.public"));

router.get("/pg/transaction/fund", (req: Request, res: Response) => {
  res.render("payment", {
    homeUrl: "http://localhost:3000",
    paystackSecret: config.get("paystack.secret"),
    paystackPublic: config.get("paystack.public")
  });
});

router.get("/", function(req: Request, res: Response, next: NextFunction) {
  res.send("Welcome to Democredit API");
});

router.get("/error", function(req: Request, res: Response, next: NextFunction) {
  throw new Error("Server ran into an error");
});

export default router;
