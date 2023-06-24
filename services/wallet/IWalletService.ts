interface IWalletService {
  createWallet(userId: string): Promise<any>;
  getWallet(walletId: string): Promise<any>;
  deposit(walletId: string, amount: number): Promise<any>;
}

export default IWalletService;
