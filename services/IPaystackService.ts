interface IPaystackService {
  verifyTransaction(transaction_id: string): Promise<any>;
  createTransferRecepient(
    bank_code: string,
    account_number: string,
    account_name: string
  ): Promise<any>;
  initiateTransfer(
    amount: number,
    reference: string,
    recipient: string,
    reason: string
  ): Promise<any>;
  resolveAccountDetails(account_number: string, bank_code: string): Promise<any>;
  listBankCodes(country: string): Promise<any>;
}

export default IPaystackService;
