import { Request, Response, NextFunction } from "express";
import AccountView from "./AccountView";
import AccountRegister from "./AccountRegister";
import AccountLogin from "./AccountLogin";
import AccountRepository from "./KnexAccountRepository";
import AccountResponseFormat from "./AccountResponseFormat";
import { signUp as signUpValidation, signIn as signInValidation } from "./AccountValidation";
import Bcrypt from "../../libraries/bcrypt";
import UUID from "../../libraries/uuid";

// create class dependencies once to save memory
const accountRepository = new AccountRepository();

export async function viewAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const { account_id } = req.params;
    const accountView = new AccountView(accountRepository);
    accountView.setAccountId(account_id);

    const action = await accountView.init();
    return AccountResponseFormat.getAccount(res, action);
  } catch (e) {
    next(e);
  }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, password } = await signUpValidation(req.body);
    const accountRegister = new AccountRegister(accountRepository, Bcrypt);
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

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = await signInValidation(req.body);
    const accountLogin = new AccountLogin(accountRepository, UUID);
    accountLogin.setEmail(email);
    accountLogin.setPassword(password);

    const action = await accountLogin.init();
    return AccountResponseFormat.signIn(res, action);
  } catch (e) {
    next(e);
  }
}
