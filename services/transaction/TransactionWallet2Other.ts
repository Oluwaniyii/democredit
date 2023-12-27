import Transaction from "./Transaction";
import ITransactionRepository from "./ITransactionRepository";
import IWalletService from "../wallet/IWalletService";
import IPaystackService from "../IPaystackService";
import AppException from "../AppException";
import { domainError } from "../domainError";

class TransactionWallet2Other extends Transaction {
  private userId: string;
  private bankCode: string;
  private accountNumber: string;
  private accountName: string;
  private recipientId: number;
  private recipientCode: string;

  private reason: string;
  private initiatorWallet: any;

  private _repository: ITransactionRepository;
  private _walletService: IWalletService;
  private _paystackService: IPaystackService;

  constructor(
    transactionRepository: ITransactionRepository,
    walletService: IWalletService,
    paystackService: IPaystackService
  ) {
    super();

    this._repository = transactionRepository;
    this._walletService = walletService;
    this._paystackService = paystackService;
    this.transactionType = "WITHDRAW";
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public setWalletId(wallet_id: string) {
    this.initiatingWallet = wallet_id;
  }

  public setAmount(amount: number) {
    this.amount = amount;
  }

  public setBankCode(bankCode: string) {
    this.bankCode = bankCode;
  }

  public setAccountNumber(accountNumber: string) {
    this.accountNumber = accountNumber;
  }

  public setAccountName(accountName: string) {
    this.accountName = accountName;
  }

  private check_if_recipient_is_provided() {
    return !!(this.bankCode && this.accountNumber);
  }

  async createNewRecipient() {
    const { account_name } = await this._paystackService.resolveAccountDetails(
      this.accountNumber,
      this.bankCode
    );
    this.accountName = account_name;

    if (!account_name) throw new Error("invalid recipient provided");

    const { recipient_code, details } = await this._paystackService.createTransferRecepient(
      this.bankCode,
      this.accountNumber,
      this.accountName
    );
    this.recipientCode = recipient_code;

    const { id: recipientId } = await this._repository.createTransferRecipient({
      bankCode: this.bankCode,
      bankAccountNumber: this.accountNumber,
      bankAccountName: this.accountName,
      PSRecipientCode: this.recipientCode
    });

    this.recipientId = recipientId;
  }

  async get_default_recipient() {
    const recipientData = await this._repository.getDefaultTransferRecipient(this.userId);
    if (!recipientData)
      throw new AppException(
        domainError.TRANSACTION_FAILURE,
        "No default recipient associated with your account, please provide a recipient for withdrawal"
      );

    const { ps_recipient_code, bank_account_number, bank_account_name, bank_code } = recipientData;
    this.recipientCode = ps_recipient_code;
    this.accountName = bank_account_number;
    this.bankCode = bank_code;
  }

  async setup_recipient() {
    const recipientData = await this._repository.getTransferRecipient(
      this.accountNumber,
      this.bankCode
    );

    if (!recipientData) return await this.createNewRecipient();

    const {
      id,
      bank_account_number,
      bank_code,
      ps_recipient_code,
      bank_account_name
    } = recipientData;
    this.recipientCode = ps_recipient_code;
    this.bankCode = bank_code;
    this.accountName = bank_account_name;
    this.accountNumber = bank_account_number;
    this.recipientId = id;
  }

  private async getInitiatorWallet(): Promise<void> {
    const wallet: any = (await this._walletService.getWallet(this.initiatingWallet))["wallet"];

    this.initiatorWallet = wallet;
  }

  private async loadTransferRecipient() {
    const is_recipient_provided = this.check_if_recipient_is_provided();

    if (is_recipient_provided) await this.setup_recipient();
    else await this.get_default_recipient();
  }

  private async createWithdraw() {
    const transaction: any = await this._repository.createTransactionWallet2Other(this.serialize());
    const { id: transaction_id, created_at, status } = transaction;

    this.id = transaction_id;
    this.created_at = created_at;
    this.status = status;
  }

  async debitWallet() {
    this.initiatorWallet = (
      await this._walletService.withdraw(this.initiatingWallet, this.amount, this.id)
    )["wallet"];

    await this._repository.writeLog(
      this.initiatingWallet,
      this.id,
      this.amount,
      "DEBIT",
      this.initiatorWallet.getBalance(),
      `bank transfer to ${this.accountName} ${this.accountNumber}`
    );
  }

  async reverseDebit() {
    this.initiatorWallet = (
      await this._walletService.deposit(this.initiatingWallet, this.amount, this.id)
    )["wallet"];

    await this._repository.writeLog(
      this.initiatingWallet,
      this.id,
      this.amount,
      "CREDIT",
      this.initiatorWallet.getBalance(),
      `reversal transfer from transaction ${this.id}`
    );
  }

  async init() {
    await this.getInitiatorWallet();
    await this.loadTransferRecipient();
    await this.createWithdraw();

    await this.debitWallet();

    const transferDetails: any = await this._paystackService.initiateTransfer(
      this.amount * 100, //paystack amount always by 100
      this.id,
      this.recipientCode,
      this.reason || ""
    );
    this.status = transferDetails.status.toUpperCase();

    if (this.status !== "SUCCESS") await this.reverseDebit();

    await this._repository.updateTransactionWallet2Other(this.serialize());

    return {
      transaction: this.serialize(),
      wallet: this.initiatorWallet
    };
  }

  serialize(): any {
    return {
      id: this.id,
      transactionType: this.transactionType,
      amount: this.amount,
      status: this.status,
      initiatingWallet: this.initiatingWallet,
      accountName: this.accountName,
      accountNumber: this.accountNumber,
      bankCode: this.bankCode,
      transferRecipientId: this.recipientId
    };
  }
}

export default TransactionWallet2Other;
