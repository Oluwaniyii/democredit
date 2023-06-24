import IWalletService from "./IWalletService";
import WalletView from "./WalletView";
import WalletDeposit from "./WalletDeposit";
import WalletWithdraw from "./WalletWithdraw";
import WalletRepository from "./WalletRepository";
import KnexWalletRepository from "./KnexWalletRepository";
import WalletCreate from "./WalletCreate";

const walletRepository = new KnexWalletRepository();

class WalletEntry implements IWalletService {
  constructor() {}
  /**
   * @description
   * @Param_Object {*} 0:
   * @returns object
   */
  async createWallet(userId: string): Promise<any> {
    const walletCreate = new WalletCreate(walletRepository);
    const action = await walletCreate.init(userId);
    return action;
  }

  async getWallet(walletId: string): Promise<any> {
    const walletView = new WalletView(walletRepository);
    const action = await walletView.init(walletId);
    return action;
  }

  async deposit(walletId: string, amount: number): Promise<any> {
    const walletDeposit = new WalletDeposit(walletRepository);
    const action = await walletDeposit.init(walletId, amount);
    return action;
  }

  async withdraw(walletId: string, amount: number): Promise<any> {
    const walletWithdraw = new WalletWithdraw(walletRepository);
    const action = await walletWithdraw.init(walletId, amount);
    return action;
  }
}

export default WalletEntry;
