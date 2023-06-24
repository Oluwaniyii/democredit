import IWalletRepository from "./IWalletRepository";
import Wallet from "./Wallet";
import AppException from "../AppException";
import { domainError } from "../domainError";

type WalletViewReturnValue = {
  wallet: Wallet;
};

class WalletView {
  private _repository: IWalletRepository;

  constructor(walletRepository: IWalletRepository) {
    this._repository = walletRepository;
  }

  async init(wallet_id: string): Promise<WalletViewReturnValue> {
    const wallet: Wallet | null = await this._repository.getWallet(wallet_id);
    if (!wallet)
      throw new AppException(domainError.NOT_FOUND, `wallet ${wallet_id} does not exist`);

    return { wallet };
  }
}

export default WalletView;
