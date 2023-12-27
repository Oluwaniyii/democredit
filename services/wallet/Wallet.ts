import AppException from "../AppException";
import { domainError } from "../domainError";

class Wallet {
  private id: string;
  private balance: number;
  private accountName: string;
  private accountEmail: string;

  constructor(id: string, balance: number, accountName: string, accountEmail: string) {
    this.id = id;
    this.balance = balance;
    this.accountName = accountName;
    this.balance = balance;
    this.accountEmail = accountEmail;
  }

  public getId(): string {
    return this.id;
  }

  public getBalance(): number {
    return this.balance;
  }

  public getAccountName(): string {
    return this.accountName;
  }

  public getAccountEmail(): string {
    return this.accountEmail;
  }

  deposit(amount: number) {
    if (amount < 0.1)
      throw new AppException(
        domainError.WALLET_DEPOSIT_ERROR,
        "invalid amount!, amount can't be less than 0.1"
      );

    this.balance += amount;
  }

  withdraw(amount: number) {
    if (amount < 0.1)
      throw new AppException(
        domainError.WALLET_WITHDRAW_ERROR,
        "invalid amount!, amount can't be less than 0.1"
      );

    if (this.balance < amount)
      throw new AppException(
        domainError.WALLET_WITHDRAW_ERROR,
        "insufficient funds!, balance is lower than amount requested"
      );

    this.balance -= amount;
  }

  serialize() {
    return {
      id: this.id,
      balance: this.balance,
      accountName: this.accountName,
      accountEmail: this.accountEmail
    };
  }
}

export default Wallet;
