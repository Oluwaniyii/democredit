import { Router } from "express";
import { viewAccount, signUp, signIn } from "./AccountController";

const router: Router = Router();

router.post("/", signUp);
router.post("/signin", signIn);
router.get("/:account_id", viewAccount);

export default router;
