import IAccountRepository from "./IAccountRepository";
import Account from "./Account";
import IWalletService from "../../services/wallet/IWalletService";
import AppException from "../AppException";
import { domainError } from "../domainError";

class AccountViewAllInfo {
  private accountId: string;

  private _repository: IAccountRepository;
  private _walletService: IWalletService;

  constructor(accountRepository: IAccountRepository, walletService: IWalletService) {
    this._repository = accountRepository;
    this._walletService = walletService;
  }

  async init(): Promise<any> {
    const list = [];
    const accounts: [] = await this._repository.getAllAccounts();

    for (let i = 0; i < accounts.length; i++) {
      const account: any = accounts[i];
      const wallet: any = (await this._walletService.getUserWallet(account.id))["wallet"];

      list.push({
        account_id: account.id,
        account_name: account.name,
        account_email: account.email,
        wallet_id: wallet.id,
        wallet_balance: wallet.balance
      });

      if (i === accounts.length - 1) return list;
    }
  }
}

export default AccountViewAllInfo;
