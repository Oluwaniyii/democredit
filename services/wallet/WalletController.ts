import { Request, Response, NextFunction } from "express";
import WalletCreate from "./WalletCreate";
import WalletView from "./WalletView";
import WalletResponseFormat from "./WalletResponseFormat";
import WalletDeposit from "./WalletDeposit";
import WalletWithdraw from "./WalletWithdraw";
import WalletRepository from "./WalletRepository";
import KnexWalletRepository from "./KnexWalletRepository";

const walletRepository = new KnexWalletRepository();

export async function getWallet(req: Request, res: Response, next: NextFunction) {
  try {
    const { wallet_id } = req.params;
    const walletView = new WalletView(walletRepository);
    const action = await walletView.init(wallet_id);
    return WalletResponseFormat.getWallet(res, action);
  } catch (e) {
    next(e);
  }
}
