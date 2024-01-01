import Wallet from "./Wallet";

interface IWalletRepository {
  createWallet(account_id: string): Promise<Wallet>;
  getWallet(wallet_id: string): Promise<Wallet>;
  getUserWallet(user_id: string): Promise<Wallet | null>;
  save(wallet: Wallet): Promise<void>;
}

export default IWalletRepository;
