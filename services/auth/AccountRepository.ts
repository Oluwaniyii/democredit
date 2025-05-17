import IAccountRepository from "./IAccountRepository";
import Account from "./Account";
import UserModel from "../shared/Model/UserModel";

class AccountRepository implements IAccountRepository {
  async getAccountById(account_id: string): Promise<Account | null> {
    let user = await UserModel.findOne({ where: { id: account_id } });

    if (user)
      return new Account(
        user.id,
        user.name,
        user.email,
        user.phone,
        user.password,
        user.created_at
      );

    return null;
  }

  async emailExists(email: string): Promise<boolean> {
    return !!(await UserModel.findOne({ where: { email } }));
  }

  async createAccount(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<Account> {
    const newUser = await UserModel.create({ name, email, phone, password });

    return new Account(
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.phone,
      newUser.password,
      newUser.created_at
    );
  }

  async getAccountByEmail(email: string): Promise<Account | null> {
    const user = await UserModel.findOne({ where: { email } });
    if (user)
      return new Account(
        user.id,
        user.name,
        user.email,
        user.phone,
        user.password,
        user.created_at
      );
    else return null;
  }

  async getAllAccounts(): Promise<any> {
    const users = await UserModel.findAll({ raw: true });
    return users;
  }
}

export default AccountRepository;
