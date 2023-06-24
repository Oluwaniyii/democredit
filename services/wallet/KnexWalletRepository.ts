import IWalletRepository from "./IWalletRepository";
import Wallet from "./Wallet";
import { knexConnection as knex } from "../../app/service-providers/knex";
import UUID from "../../libraries/uuid";
import { domainError } from "../domainError";
import AppException from "../AppException";

class KnexWalletRepository implements IWalletRepository {
  public async createWallet(account_id: string): Promise<Wallet> {
    const wallet_id = UUID.generate();
    await knex("wallet").insert({
      id: wallet_id,
      user_id: account_id
    });

    const wallet = await this.getWallet(wallet_id);
    if (wallet) return wallet;
    else throw new Error("wallet creation error");
  }

  public async getWallet(wallet_id: string): Promise<Wallet> {
    const wallet = await knex("wallet")
      .join("user", "user.id", "wallet.user_id")
      .select("wallet.id", "wallet.user_id", "wallet.balance", "user.name", "user.email")
      .where("wallet.id", wallet_id)
      .first();

    if (!wallet)
      throw new AppException(domainError.NOT_FOUND, `wallet ${wallet_id} does not exist`);

    const { id, balance, name: userName, email: userEmail } = wallet;
    return new Wallet(id, balance, userName, userEmail);
  }

  public async save(wallet: Wallet): Promise<void> {
    const { id, balance } = wallet.serialize();

    await knex("wallet")
      .update({
        balance: balance
      })
      .where("wallet.id", id);
  }
}

export default KnexWalletRepository;
