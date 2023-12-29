import ITransactionRepository from "./ITransactionRepository";
import { domainError } from "../domainError";

class TransactionViewMany {
  private walletId: string;
  private limit: number;
  private page: number;

  private _repository: ITransactionRepository;

  constructor(transactionRepository: ITransactionRepository) {
    this._repository = transactionRepository;
  }

  setWalletId(walletId: string) {
    this.walletId = walletId;
  }

  setLimit(limit: any = "10") {
    this.limit = parseInt(limit);
  }

  setPage(page: any = "1") {
    this.page = parseInt(page);
  }

  async init(): Promise<any> {
    const transactionHistoryData: any = await this._repository.getTransactionHistory(
      this.walletId,
      this.limit,
      this.page
    );

    return transactionHistoryData;
  }
}

export default TransactionViewMany;
