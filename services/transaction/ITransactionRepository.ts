import Transaction from "./Transaction";

interface ITransactionRepository {
  createTransactionFund(fields: any): Promise<any>;
  getTransactionFund(transaction_id: string): Promise<any>;
  updateTransactionFund(fields: any): Promise<any>;

  createTransactionWallet2Wallet(fields: any): Promise<any>;

  createTransactionWithdraw(fields: any): Promise<any>;
  updateTransactionWithdraw(fields: any): Promise<any>;

  createTransferRecipient(fields: any): Promise<any>;
  getDefaultTransferRecipient(fields: any): Promise<any>;
  getTransferRecipient(accountNumber: string, bankCode: string): Promise<any>;
}

export default ITransactionRepository;
