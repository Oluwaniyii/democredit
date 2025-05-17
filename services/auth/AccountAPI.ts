import { Router } from "express";
import AccountController from "./AccountController";

const router: Router = Router();

router.post("/", AccountController.signUp);
router.post("/signin", AccountController.signIn);
router.get("/:account_id", AccountController.getAccount);
router.get("/", AccountController.getAccountAllInfo);

export default router;
