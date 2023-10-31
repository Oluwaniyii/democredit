class Transaction {
  public id: string;
  public transactionType: string;
  public amount: number;
  public status: string;
  public initiatingWallet: string;
  public created_at: string;

  constructor() {}
}

export default Transaction;
