import AppException from "../AppException";
import IAccountRepository from "./IAccountRepository";
import Account from "./Account";
import { domainError } from "../domainError";
import IWalletService from "../wallet/IWalletService";

class AccountRegister {
  private name: string;
  private email: string;
  private phone: string;
  private password: string;

  private _repository: IAccountRepository;
  private _bcrypt: any;
  private _walletService: IWalletService;

  constructor(AccountRepository: IAccountRepository, Bcrypt: any, walletService: IWalletService) {
    this._repository = AccountRepository;
    this._bcrypt = Bcrypt;
    this._walletService = walletService;
  }

  cleanPhoneNumber(phone: string): string {
    phone = phone.replace(/(\+234)|0/, ""); // Remove preceding "+234" or "0"
    phone = phone.replaceAll(/-/g, ""); // Remove seperating "-"

    return phone;
  }

  setName(name: string): void {
    this.name = name;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = this.cleanPhoneNumber(phone);
  }

  setPassword(password: string): void {
    this.password = password;
  }

  async init(): Promise<any> {
    const isEmailTaken = await this._repository.emailExists(this.email);
    if (isEmailTaken)
      throw new AppException(
        domainError.UNAVAILABLE_EMAIL_ADDRESS,
        "email is registered with another account"
      );

    const hashedPassword: string = await this._bcrypt.hash(this.password, 10);
    const account: Account = await this._repository.createAccount(
      this.name,
      this.email,
      this.phone,
      hashedPassword
    );
    const wallet: any = (await this._walletService.createWallet(account.getId()))["wallet"];

    return { account, wallet };
  }
}

export default AccountRegister;
