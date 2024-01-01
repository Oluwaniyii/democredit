interface IWalletService {
  createWallet(userId: string): Promise<any>;
  getWallet(walletId: string): Promise<any>;
  getUserWallet(walletId: string): Promise<any>;
  deposit(walletId: string, amount: number, transactionId: string): Promise<any>;
  withdraw(walletId: string, amount: number, transactionId: string): Promise<any>;
}

export default IWalletService;
