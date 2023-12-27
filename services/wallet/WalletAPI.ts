import { Router } from "express";
import WalletController from "./WalletController";

const router: Router = Router();

router.get("/:wallet_id", WalletController.getWallet);

export default router;
