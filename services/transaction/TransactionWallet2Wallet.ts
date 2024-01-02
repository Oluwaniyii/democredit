import Transaction from "./Transaction";
import ITransactionRepository from "./ITransactionRepository";
import IWalletService from "../wallet/IWalletService";
import AppException from "../AppException";
import { domainError } from "../domainError";

class TransactionWallet2Wallet extends Transaction {
  private receivingWallet: string;

  private initiatorWallet: any;
  private receiverWallet: any;

  private _repository: ITransactionRepository;
  private _walletService: IWalletService;

  constructor(transactionRepository: ITransactionRepository, walletService: IWalletService) {
    super();

    this._repository = transactionRepository;
    this._walletService = walletService;
    this.transactionType = "TRANSFER";
  }

  public setInitiatorWallet(walletId: string) {
    this.initiatingWallet = walletId;
  }
  public setReceivingWallet(walletId: string) {
    this.receivingWallet = walletId;
  }
  public setAmount(amount: number) {
    this.amount = amount;
  }

  private async getWallet(walletId: string): Promise<any> {
    const wallet: any = (await this._walletService.getWallet(walletId))["wallet"];
    return wallet;
  }

  private async getInitiatorWallet(): Promise<void> {
    const initiatorWallet: any = await this.getWallet(this.initiatingWallet);
    if (!initiatorWallet) throw new AppException(domainError.INVALID_WALLET_ID);

    this.initiatorWallet = initiatorWallet;
  }

  private async getReceiverWallet(): Promise<void> {
    const receiverWallet: any = await this.getWallet(this.receivingWallet);
    if (!receiverWallet) throw new AppException(domainError.INVALID_WALLET_ID);

    this.receiverWallet = receiverWallet;
  }

  private async createLogs() {
    await this._repository.writeLog(
      this.initiatingWallet,
      this.id,
      this.amount,
      "DEBIT",
      this.initiatorWallet.getBalance(),
      `wallet transfer to ${this.receiverWallet.getAccountName()} ${this.receiverWallet.getId()}`
    );

    await this._repository.writeLog(
      this.receivingWallet,
      this.id,
      this.amount,
      "CREDIT",
      this.receiverWallet.getBalance(),
      `wallet deposit from ${this.initiatorWallet.getAccountName()} ${this.initiatorWallet.getId()}`
    );
  }

  async createTransfer(): Promise<any> {
    const { id, created_at } = await this._repository.createTransactionWallet2Wallet(
      this.serialize()
    );

    this.id = id;
    this.created_at = created_at;
  }

  public async initialize() {
    await this.getInitiatorWallet();
    await this.getReceiverWallet();

    this.initiatorWallet = (
      await this._walletService.withdraw(this.initiatingWallet, this.amount, this.id)
    )["wallet"];

    this.receiverWallet = (
      await this._walletService.deposit(this.receivingWallet, this.amount, this.id)
    )["wallet"];

    this.status = "SUCCESS";

    await this.createTransfer();
    await this.createLogs();

    return {
      transaction: this.serialize(),
      wallet: this.initiatorWallet,
      receiverWallet: this.receiverWallet
    };
  }

  serialize(): any {
    return {
      id: this.id,
      transactionType: this.transactionType,
      amount: this.amount,
      status: this.status,
      initiatingWallet: this.initiatingWallet,
      receivingWallet: this.receivingWallet
    };
  }
}

export default TransactionWallet2Wallet;

/*
TransactionWallet2Wallet {
  id: 'b2544e70-58ea-4e7e-8931-60e64337b5c2',
  transactionType: 'TRANSFER',
  amount: 30,
  status: 'SUCCESS',
  initiatingWallet: '4ef28a3d-2fe0-489e-bd7f-dc820509d075',
  created_at: 2024-01-01T17:05:30.894Z,
  receivingWallet: '4ef28a3d-2fe0-489e-bd7f-dc820509d075',
  initiatorWallet: Wallet {
    id: '4ef28a3d-2fe0-489e-bd7f-dc820509d075',
    balance: 5240,
    accountName: 'Tee Johnson',
    accountEmail: 'teejohnson@gmail.com'
  },
  receiverWallet: Wallet {
    id: '4ef28a3d-2fe0-489e-bd7f-dc820509d075',
    balance: 5300,
    accountName: 'Tee Johnson',
    accountEmail: 'teejohnson@gmail.com'
  },
  _repository: TransactionRepository {
    getDefinedFields: [Function: getDefinedFields]
  },
  _walletService: WalletService {}
}
*/
