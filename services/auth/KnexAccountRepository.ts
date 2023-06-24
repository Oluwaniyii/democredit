import { knexConnection as knex } from "../../app/service-providers/knex";
import IAccountRepository from "./IAccountRepository";
import Account from "./Account";
import UUID from "../../libraries/uuid";

class KnexAccountRepository implements IAccountRepository {
  public async getAccountById(account_id: string): Promise<Account | null> {
    const user = await knex("user")
      .select()
      .where("user.id", account_id)
      .first();

    if (!user) return null;
    return new Account(user.id, user.name, user.email, user.phone, user.password, user.created_at);
  }

  public async emailExists(email: string): Promise<boolean> {
    const user = await knex("user")
      .select()
      .where("user.email", email)
      .first();

    return !!user;
  }

  public async createAccount(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<Account> {
    const account_id = UUID.generate();
    await knex("user").insert({
      id: account_id,
      name,
      email,
      phone,
      password
    });

    const account = await this.getAccountById(account_id);
    if (account) return account;
    else throw new Error("account creation error");
  }

  public async getAccountByEmail(email: string): Promise<Account | null> {
    const user = await knex("user")
      .select()
      .where("user.email", email)
      .first();

    if (!user) return null;
    return new Account(user.id, user.name, user.email, user.phone, user.password, user.created_at);
  }
}

export default KnexAccountRepository;
