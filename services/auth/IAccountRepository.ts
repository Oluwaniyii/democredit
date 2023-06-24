import Account from "./Account";

interface IAccountRepository {
  getAccountById(account_id: string): Promise<Account | null>;
  emailExists(email: string): Promise<boolean>;
  createAccount(name: string, email: string, phone: string, password: string): Promise<Account>;
  getAccountByEmail(email: string): Promise<Account | null>;
}

export default IAccountRepository;
