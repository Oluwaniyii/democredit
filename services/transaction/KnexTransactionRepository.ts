import ITransactionRepository from "./ITransactionRepository";
import Transaction from "./Transaction";
import { knexConnection as knex } from "../../app/service-providers/knex";
import UUID from "../../libraries/uuid";

class KnexTransactionRepository implements ITransactionRepository {
  public async createTransaction(fields: any): Promise<any> {
    const { transaction_type, initiator_name, initiator_bank, initiator_account } = fields;
    const transaction_id = UUID.generate();

    await knex("transaction").insert({
      id: transaction_id,
      transaction_type,
      initiator_name,
      initiator_bank,
      initiator_account
    });

    return await this.getTransaction(transaction_id);
  }

  async getTransaction(transaction_id: string): Promise<any | null> {
    const transactionData = await knex("transaction")
      .select()
      .where("transaction.id", transaction_id)
      .first();

    return transactionData;
  }

  async updateTransaction(transaction: any): Promise<void> {
    const {
      id: transaction_id,
      transactionType: transaction_type,
      amount,
      status,
      initiator_bank,
      initiator_name,
      initiator_account,
      receiver_name,
      receiver_bank,
      receiver_account,
      channel,
      authorizing_bank
    } = transaction;

    await knex("fund").insert({
      transaction_id,
      channel,
      authorizing_bank
    });

    await knex("transaction")
      .update({
        transaction_type,
        amount,
        status,
        initiator_bank,
        initiator_name,
        initiator_account,
        receiver_name,
        receiver_bank,
        receiver_account
      })
      .where("transaction.id", transaction_id);

    // insert in fund
  }
}

export default KnexTransactionRepository;
