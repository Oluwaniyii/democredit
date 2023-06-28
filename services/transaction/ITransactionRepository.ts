import Transaction from "./Transaction";

interface ITransactionRepository {
  createTransaction(fields: any): Promise<any>;
  getTransaction(transaction_id: string): Promise<any>;
  updateTransaction(transaction: any): Promise<void>;
}

export default ITransactionRepository;
