import IAccountRepository from "./IAccountRepository";
import Account from "./Account";
import IWalletService from "../../services/wallet/IWalletService";
import JWT from "../../libraries/jwt";
import AppException from "../AppException";
import { domainError } from "../domainError";

class AccountLogin {
  private email: string;
  private password: string;

  private account: Account;
  private wallet: any;

  private _repository: IAccountRepository;
  private _uuid: any;
  private _walletService: IWalletService;

  constructor(accountRepository: IAccountRepository, UUID: any, walletService: IWalletService) {
    this._repository = accountRepository;
    this._uuid = UUID;
    this._walletService = walletService;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  async authenticate(): Promise<boolean> {
    let isEmailAvailable;
    let isAuthenticated = false;

    const account: Account | null = await this._repository.getAccountByEmail(this.email);
    if (!account) return isAuthenticated;

    isAuthenticated = true;
    this.account = account;
    return isAuthenticated;
  }

  async issueNewSession() {
    const issued_at = new Date().getTime();
    const expire_in = 86400000;

    const data = {
      id: this.account.getId(),
      name: this.account.getName(),
      email: this.account.getEmail(),
      wallet_id: this.wallet.id
    };

    const payload = { data, issued_at, expire_in };
    const jwt_token = await JWT.sign(payload);

    return {
      id: jwt_token,
      issued_at,
      expire_in
    };
  }

  async init() {
    if (!(await this.authenticate())) throw new AppException(domainError.INVALID_CREDENTIALS);

    this.wallet = (await this._walletService.getUserWallet(this.account.getId()))["wallet"];
    const session = await this.issueNewSession();

    return { account: this.account, wallet: this.wallet, session: session };
  }
}

export default AccountLogin;
