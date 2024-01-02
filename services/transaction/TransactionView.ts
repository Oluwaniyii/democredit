import ITransactionRepository from "./ITransactionRepository";
import IWalletService from "../wallet/IWalletService";
import AppException from "../../services/AppException";
import { domainError } from "../domainError";

class TransactionView {
  private transactionId: string;

  private _repository: ITransactionRepository;
  private _walletService: IWalletService;

  constructor(transactionRepository: ITransactionRepository, walletService: IWalletService) {
    this._repository = transactionRepository;
    this._walletService = walletService;
  }

  setTransactionId(transactionId: string) {
    this.transactionId = transactionId;
  }

  async init(): Promise<any> {
    const transactionType = await this._repository.getTransactionType(this.transactionId);
    if (!transactionType)
      throw new AppException(
        domainError.NOT_FOUND,
        `transaction with id ${this.transactionId} not found`
      );

    if (transactionType === "WITHDRAW") {
      const transaction: any = await this._repository.getTransactionWallet2Other(
        this.transactionId
      );
      const recipient = await this._repository.getTransferRecipientById(transaction.recipientId);
      return { transactionType, transaction, recipient };
    } else if (transactionType === "TRANSFER") {
      const transaction: any = await this._repository.getTransactionWallet2Wallet(
        this.transactionId
      );
      const { wallet } = await this._walletService.getWallet(transaction.receivingWallet);
      return { transactionType, transaction, wallet };
    } else if (transactionType === "FUND") {
      const transaction: any = await this._repository.getTransactionFund(this.transactionId);
      return { transactionType, transaction };
    }
  }
}

export default TransactionView;
