class Transaction {
  public id: string;
  public transactionType: string;
  public amount: number;
  public status: string;
  public initiator_name: string;
  public initiator_bank: string;
  public initiator_account: string;
  public created_at: string;

  constructor() {}
}

export default Transaction;
