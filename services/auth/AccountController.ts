import { Request, Response, NextFunction } from "express";
import AccountView from "./AccountView";
import AccountRegister from "./AccountRegister";
import AccountLogin from "./AccountLogin";
import AccountRepository from "./AccountRepository";
import AccountResponseFormat from "./AccountResponseFormat";
import AccountValidation from "./AccountValidation";
import Bcrypt from "../../libraries/bcrypt";
import UUID from "../../libraries/uuid";
import WalletService from "../wallet/WalletService";

// create dependencies once to save memory
const accountRepository = new AccountRepository();
const walletService = new WalletService();

class AccountController {
  public static async getAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { account_id } = req.params;
      const accountView = new AccountView(accountRepository, walletService);
      accountView.setAccountId(account_id);

      const action = await accountView.init();
      return AccountResponseFormat.getAccount(res, action);
    } catch (e) {
      next(e);
    }
  }

  public static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, password } = await AccountValidation.signUp(req.body);
      const accountRegister = new AccountRegister(accountRepository, Bcrypt, walletService);
      accountRegister.setName(name);
      accountRegister.setEmail(email);
      accountRegister.setPhone(phone);
      accountRegister.setPassword(password);

      const action = await accountRegister.init();
      return AccountResponseFormat.signUp(res, action);
    } catch (e) {
      next(e);
    }
  }

  public static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = await AccountValidation.signIn(req.body);
      const accountLogin = new AccountLogin(accountRepository, UUID, walletService);
      accountLogin.setEmail(email);
      accountLogin.setPassword(password);

      const action = await accountLogin.init();
      return AccountResponseFormat.signIn(res, action);
    } catch (e) {
      next(e);
    }
  }
}

export default AccountController;
