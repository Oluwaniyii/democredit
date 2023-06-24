import IWalletRepository from "./IWalletRepository";
import Wallet from "./Wallet";

class WalletDeposit {
  private _repository: IWalletRepository;
  private wallet: Wallet;

  constructor(walletRepository: IWalletRepository) {
    this._repository = walletRepository;
  }

  async init(walletId: string, amount: number) {
    const wallet = await this._repository.getWallet(walletId);

    this.wallet = wallet;
    this.wallet.deposit(amount);
    await this._repository.save(this.wallet);

    return { wallet: this.wallet };
  }
}

export default WalletDeposit;
