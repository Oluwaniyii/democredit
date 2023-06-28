import config from "config";
import Transaction from "./Transaction";
import ITransactionRepository from "./ITransactionRepository";
import IWalletService from "../wallet/IWalletService";
import IPaystackService from "../IPaystackService";
import AppException from "../AppException";
import { domainError } from "../domainError";
// import Wallet from "../../services/wallet/Wallet";

enum TransactionType {
  "FUND",
  "WITHDRAW",
  "TRANSFER"
}

enum Channel {
  "transfer",
  "card"
}

class TransactionFund extends Transaction {
  private channel: string | null;
  private authorizing_bank: string | null; // optional

  private _repository: ITransactionRepository;
  private _walletService: IWalletService;
  private _paystackService: IPaystackService;

  private initiatorWallet: any;
  private userId: string;
  private userEmail: string;

  constructor(
    transactionRepository: ITransactionRepository,
    walletService: IWalletService,
    paystackService: IPaystackService
  ) {
    super();

    this._repository = transactionRepository;
    this._walletService = walletService;
    this._paystackService = paystackService;
    this.transactionType = "FUND";
    this.initiator_bank = "democredit";
  }

  private async createTransaction() {
    const transaction = await this._repository.createTransaction({
      transaction_type: this.transactionType,
      initiator_name: this.initiator_name,
      initiator_bank: this.initiator_bank,
      initiator_account: this.initiator_account
    });

    const { id: transactionId, status } = transaction;

    this.id = transactionId;
    this.status = status;
  }

  private async getTransaction() {
    const transaction = await this._repository.getTransaction(this.id);

    if (!transaction) throw new AppException(domainError.INVALID_TRANSACTION_REFERENCE);

    this.id = transaction.id;
    this.transactionType = transaction.transaction_type;
    this.amount = transaction.amount;
    this.status = transaction.status;
    this.initiator_name = transaction.initiator_name;
    this.initiator_bank = transaction.initiator_bank;
    this.initiator_account = transaction.initiator_account;
    this.created_at = transaction.created_at;
  }

  private async getWallet() {
    const initiatorWallet: any = (await this._walletService.getWallet(this.initiator_account))[
      "wallet"
    ];

    this.initiatorWallet = initiatorWallet;
    this.initiator_name = initiatorWallet.accountName;
    this.userEmail = initiatorWallet.accountEmail;
  }

  private async creditWallet() {
    const wallet: any = (
      await this._walletService.deposit(this.initiatorWallet.getId(), this.amount)
    )["wallet"];

    this.initiatorWallet = wallet;
  }

  public setWalletId(wallet_id: string) {
    this.initiator_account = wallet_id;
  }

  public setTransactionId(transaction_id: string) {
    this.id = transaction_id;
  }

  public async initializeFund() {
    await this.getWallet();
    await this.createTransaction();

    const paymentLink = `${config.get("app.baseURL")}/pg/transaction/fund?ref=${"tr_" +
      this.id}&email=${this.userEmail}`;

    return { paymentLink };
  }

  public async completeFund() {
    await this.getTransaction();
    await this.getWallet();

    const transactionReference = `tr_${this.id}`;
    const { data: PSTransactionDetails } = await this._paystackService.verifyTransaction(
      transactionReference
    );
    const { status, amount, channel, authorization } = PSTransactionDetails;

    this.status = status;
    this.amount = amount / 100; // paystack logic requires you to multiply actual amount by 10 on payment
    this.channel = channel;
    this.authorizing_bank = authorization.bank;

    if (status === "success") await this.creditWallet();

    await this._repository.updateTransaction(this.serialize());
    return { transaction: this.serialize(), wallet: this.initiatorWallet };
  }

  public serialize() {
    return {
      id: this.id,
      transactionType: this.transactionType,
      amount: this.amount,
      status: this.status,
      initiator_name: this.initiator_name,
      initiator_bank: this.initiator_bank,
      initiator_account: this.initiator_account,
      created_at: this.created_at,
      channel: this.channel,
      authorizing_bank: this.authorizing_bank
    };
  }
}

export default TransactionFund;

/**
Class TransactionFund {
  id: '47e6ed32-b398-4037-a189-be00f398fc2d',
  transactionType: 'FUND',
  amount: 2000,
  status: 'success',
  initiator_name: 'John Doe',
  initiator_bank: 'Democredit',
  initiator_account: '0a477123-7935-4ca2-a884-a1fc99831f21',
  created_at: 2023-06-15T12:08:49.000Z,
  channel: 'card',
  authorizing_bank: 'TEST BANK',
  _repository: KnexTransactionRepository {},
  _walletService: WalletEntry {},
  _paystackService: PaystackService {},
  initiatorWallet: {
    wallet: Wallet {
      id: '0a477123-7935-4ca2-a884-a1fc99831f21',
      balance: 2250.22,
      accountName: 'John Doe',
      accountEmail: 'john@gmail.com'
    }
  },
  userId: undefined,
  userEmail: 'john@gmail.com'
}
 */
