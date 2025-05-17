import Transaction from "./Transaction";
import ITransactionRepository from "./ITransactionRepository";
import IWalletService from "../wallet/IWalletService";
import IPaystackService from "../IPaystackService";
import AppException from "../AppException";
import { domainError } from "../domainError";

class TransactionWallet2Other extends Transaction {
  private userId: string;
  private bankCode: string;
  private bankName: string;
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

    const recipientData = await this._paystackService.createTransferRecepient(
      this.bankCode,
      this.accountNumber,
      this.accountName
    );

    const { recipient_code, details } = recipientData;
    this.recipientCode = recipient_code;
    this.bankName = details.bank_name;

    const { id: recipientId } = await this._repository.createTransferRecipient({
      bankCode: this.bankCode,
      bankName: this.bankName,
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

    const {
      ps_recipient_code,
      bank_account_number,
      bank_account_name,
      bank_code,
      bank_name
    } = recipientData;
    this.recipientCode = ps_recipient_code;
    this.accountName = bank_account_name;
    this.accountNumber = bank_account_number;
    this.bankCode = bank_code;
    this.bankName = bank_name;
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
      bank_account_name,
      bank_name
    } = recipientData;
    this.recipientCode = ps_recipient_code;
    this.bankCode = bank_code;
    this.bankName = bank_name;
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
      `bank transfer to ${this.accountName}`
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

    console.log(this);

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

/*
TransactionWallet2Other {
  id: '8a55ac64-7069-4c07-a91e-2d1c76600b54',
  transactionType: 'WITHDRAW',
  amount: 50,
  status: 'SUCCESS',
  initiatingWallet: '4ef28a3d-2fe0-489e-bd7f-dc820509d075',
  created_at: 2024-01-01T17:32:28.240Z,
  userId: '26e7af11-c572-4071-836f-808b7ed453f2',
  bankCode: '058',
  bankName: 'Guaranty Trust Bank',
  accountNumber: '0423703103',
  accountName: 'AYODELE OLUWANIYI BENJAMIN',
  recipientId: 3,
  recipientCode: 'RCP_uqdpl154d4cv7gz',
  reason: undefined,
  initiatorWallet: Wallet {
    id: '4ef28a3d-2fe0-489e-bd7f-dc820509d075',
    balance: 5260,
    accountName: 'Tee Johnson',
    accountEmail: 'teejohnson@gmail.com'
  },
  _repository: TransactionRepository {
    getDefinedFields: [Function: getDefinedFields]
  },
  _walletService: WalletService {},
  _paystackService: PaystackService {}
}
*/
