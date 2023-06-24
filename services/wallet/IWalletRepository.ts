import Wallet from "./Wallet";

interface IWalletRepository {
  createWallet(account_id: string): Promise<Wallet>;
  getWallet(wallet_id: string): Promise<Wallet>;
  save(wallet: Wallet): Promise<void>;
}

export default IWalletRepository;
