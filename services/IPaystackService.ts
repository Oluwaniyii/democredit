interface IPaystackService {
  verifyTransaction(transaction_id: string): Promise<any>;
}

export default IPaystackService;
