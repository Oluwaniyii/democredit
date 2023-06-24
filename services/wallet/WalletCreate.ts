import IWalletRepository from "./IWalletRepository";
import Wallet from "./Wallet";
import AppException from "../AppException";
import { domainError } from "../domainError";

type WalletCreateReturnValue = {
  wallet: Wallet;
};

class WalletCreate {
  private _repository: IWalletRepository;

  constructor(walletRepository: IWalletRepository) {
    this._repository = walletRepository;
  }

  async init(user_id: string): Promise<WalletCreateReturnValue> {
    const wallet: Wallet = await this._repository.createWallet(user_id);
    return { wallet };
  }
}

export default WalletCreate;
