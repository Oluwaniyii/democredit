import IWalletRepository from "./IWalletRepository";
import Wallet from "./Wallet";

class WalletDeposit {
  private wallet: Wallet;

  private _repository: IWalletRepository;

  constructor(walletRepository: IWalletRepository) {
    this._repository = walletRepository;
  }

  async init(walletId: string, amount: number, transactionId: string) {
    this.wallet = await this._repository.getWallet(walletId);

    this.wallet.deposit(amount);
    await this._repository.save(this.wallet);

    return { wallet: this.wallet };
  }
}

export default WalletDeposit;
