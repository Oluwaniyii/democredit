import Transaction from "./Transaction";

interface ITransactionRepository {
  createTransactionFund(fields: any): Promise<any>;
  updateTransactionFund(fields: any): Promise<any>;
  getTransactionFund(transaction_id: string): Promise<any>;

  createTransactionWallet2Wallet(fields: any): Promise<any>;
  getTransactionWallet2Wallet(transaction_id: string): Promise<any>;

  createTransactionWallet2Other(fields: any): Promise<any>;
  updateTransactionWallet2Other(fields: any): Promise<any>;
  getTransactionWallet2Other(transaction_id: string): Promise<any>;

  createTransferRecipient(fields: any): Promise<any>;
  getDefaultTransferRecipient(fields: any): Promise<any>;
  getTransferRecipient(accountNumber: string, bankCode: string): Promise<any>;
  getTransferRecipientById(recipientId: string): Promise<any>;

  getTransactionHistory(walletId: string): Promise<Array<any>>;
  getTransaction(transactionId: string): Promise<any>;
  getTransactionType(transactionId: string): Promise<string>;

  writeLog(
    walletId: string,
    transactionId: string,
    amount: number,
    entryType: string,
    balance: number,
    description: string
  ): Promise<void>;
}

export default ITransactionRepository;
