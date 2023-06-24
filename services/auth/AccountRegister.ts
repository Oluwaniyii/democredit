import AppException from "../AppException";
import IAccountRepository from "./IAccountRepository";
import Account from "./Account";
import { domainError } from "../domainError";

type AccountRegisterReturnValue = {
  account: Account;
};

class AccountRegister {
  private _repository: IAccountRepository;
  private _bcrypt: any;
  private name: string;
  private email: string;
  private phone: string;
  private password: string;

  constructor(AccountRepository: IAccountRepository, Bcrypt: any) {
    this._repository = AccountRepository;
    this._bcrypt = Bcrypt;
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

  async init(): Promise<AccountRegisterReturnValue> {
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

    return { account };
  }
}

export default AccountRegister;
