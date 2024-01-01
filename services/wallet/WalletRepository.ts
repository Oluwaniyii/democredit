import IWalletRepository from "./IWalletRepository";
import MModels from "../shared/Model";
import Wallet from "./Wallet";
import AppException from "../AppException";
import { domainError } from "../domainError";

const { Wallet: WalletModel, User: Usermodel } = MModels;

class WalletRepository implements IWalletRepository {
  async createWallet(user_id: string): Promise<Wallet> {
    const { id: walletId } = await WalletModel.create({ user_id: user_id });

    const data: any = await WalletModel.findOne({
      attributes: ["id", "balance"],
      where: { id: walletId },
      include: [
        {
          model: Usermodel,
          attributes: ["id", "name", "email"],
          as: "user"
        }
      ]
    });

    const { id, balance, user } = data;
    const { id: userId, name: userName, email: userEmail } = user;

    return new Wallet(id, balance, userName, userEmail);
  }

  async getWallet(wallet_id: string): Promise<Wallet> {
    const data: any = await WalletModel.findOne({
      attributes: ["id", "balance"],
      where: { id: wallet_id },
      include: [
        {
          model: Usermodel,
          attributes: ["id", "name", "email"],
          as: "user"
        }
      ]
    });

    if (!data) throw new AppException(domainError.NOT_FOUND, `wallet ${wallet_id} does not exist`); // ?????????

    const { id, balance, user } = data;
    const { id: userId, name: userName, email: userEmail } = user;

    return new Wallet(id, balance, userName, userEmail);
  }

  async getUserWallet(user_id: string): Promise<Wallet | null> {
    const data: any = await WalletModel.findOne({
      attributes: ["id", "balance"],
      where: { user_id: user_id },
      include: [
        {
          model: Usermodel,
          attributes: ["id", "name", "email"],
          as: "user"
        }
      ]
    });
    if (!data) return null;

    const { id, balance, user } = data;
    const { id: userId, name: userName, email: userEmail } = user;

    return new Wallet(id, balance, userName, userEmail);
  }

  async save(wallet: Wallet) {
    const { id, balance } = wallet.serialize();
    WalletModel.update({ balance: balance }, { where: { id } });
  }
}

export default WalletRepository;
