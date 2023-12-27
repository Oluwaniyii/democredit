import IAccountRepository from "./IAccountRepository";
import Account from "./Account";
import IWalletService from "../../services/wallet/IWalletService";
import AppException from "../AppException";
import { domainError } from "../domainError";

class AccountView {
  private accountId: string;

  private _repository: IAccountRepository;
  private _walletService: IWalletService;

  constructor(accountRepository: IAccountRepository, walletService: IWalletService) {
    this._repository = accountRepository;
    this._walletService = walletService;
  }

  setAccountId(accountId: string) {
    this.accountId = accountId;
  }

  async init(): Promise<any> {
    const account: Account | null = await this._repository.getAccountById(this.accountId);
    if (!account)
      throw new AppException(
        domainError.NOT_FOUND,
        `account with the id ${this.accountId} does not exist`
      );

    const wallet: any = (await this._walletService.getUserWallet(account.getId()))["wallet"];

    return { account, wallet };
  }
}

export default AccountView;
