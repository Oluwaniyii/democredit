import { Router } from "express";
import { getWallet } from "./WalletController";

const router: Router = Router();

router.get("/:wallet_id", getWallet);

export default router;
