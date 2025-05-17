import { Router, Request, Response, NextFunction } from "express";
import WalletController from "./WalletController";
import jwt from "../../libraries/jwt";
import AppException from "../../services/AppException";
import { domainError } from "../../services/domainError";

const router: Router = Router();

router.get("/", AuthProtectionMiddleware, WalletController.getWallet);

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
