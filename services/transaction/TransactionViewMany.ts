import ITransactionRepository from "./ITransactionRepository";
import { domainError } from "../domainError";

class TransactionViewMany {
  private walletId: string;

  private _repository: ITransactionRepository;

  constructor(transactionRepository: ITransactionRepository) {
    this._repository = transactionRepository;
  }

  setWalletId(walletId: string) {
    this.walletId = walletId;
  }

  async init(): Promise<any> {
    const transactionHistory: any[] = await this._repository.getTransactionHistory(this.walletId);
    return { transactions: transactionHistory };
  }
}

export default TransactionViewMany;
