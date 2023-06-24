import IAccountRepository from "./IAccountRepository";
import Account from "./Account";

import AppException from "../AppException";
import { domainError } from "../domainError";

type AccountViewReturnValue = {
  account: Account;
};

class AccountView {
  private _repository: IAccountRepository;
  private accountId: string;

  constructor(accountRepository: IAccountRepository) {
    this._repository = accountRepository;
  }

  setAccountId(accountId: string) {
    this.accountId = accountId;
  }

  async init(): Promise<AccountViewReturnValue> {
    const account: Account | null = await this._repository.getAccountById(this.accountId);
    if (!account)
      throw new AppException(
        domainError.NOT_FOUND,
        `account with the id ${this.accountId} does not exist`
      );

    return { account };
  }
}

export default AccountView;
