import { Request, Response, NextFunction } from "express";
import WalletView from "./WalletView";
import WalletResponseFormat from "./WalletResponseFormat";
import WalletRepository from "./WalletRepository";
import WalletCreate from "./WalletCreate";
import WalletDeposit from "./WalletDeposit";
import WalletWithdraw from "./WalletWithdraw";

const walletRepository = new WalletRepository();

class WalletController {
  public static async getWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { wallet_id } = res.locals.authenticated_user;

      const walletView = new WalletView(walletRepository);
      const action = await walletView.init(wallet_id);
      return WalletResponseFormat.getWallet(res, action);
    } catch (e) {
      next(e);
    }
  }
}

export default WalletController;
