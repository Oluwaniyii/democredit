import { Router } from "express";
import { createWallet, getWallet } from "./WalletController";

const router: Router = Router();

router.post("/", createWallet);
router.get("/:wallet_id", getWallet);

export default router;
