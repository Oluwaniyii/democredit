import IAccountRepository from "./IAccountRepository";
import AppException from "../AppException";
import { domainError } from "../domainError";
import Account from "./Account";

class AccountLogin {
  private _repository: IAccountRepository;
  private _uuid: any;
  private email: string;
  private password: string;

  constructor(accountRepository: IAccountRepository, UUID: any) {
    this._repository = accountRepository;
    this._uuid = UUID;
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

    isEmailAvailable = await this._repository.emailExists(this.email);
    if (isEmailAvailable) isAuthenticated = true;

    return isAuthenticated;
  }

  async issueNewSession() {
    return {
      id: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${this._uuid.generate()}.ny2Gja7Y6kVB1v34fKaAbKJhNoLI879o2IV2wgM2fw8`,
      issued_at: 1685145130685,
      expire_in: 86400000
    };
  }

  async init() {
    if (!(await this.authenticate())) throw new AppException(domainError.INVALID_CREDENTIALS);

    // create a fake session token
    const account: Account | null = await this._repository.getAccountByEmail(this.email);
    const session = await this.issueNewSession();

    return { account: account, session: session };
  }
}

export default AccountLogin;
