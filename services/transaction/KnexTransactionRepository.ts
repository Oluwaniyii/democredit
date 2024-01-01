import ITransactionRepository from "./ITransactionRepository";
import Transaction from "./Transaction";
import { knexConnection as knex } from "../../app/service-providers/knex";
import UUID from "../../libraries/uuid";

class KnexTransactionRepository {
  public async createTransaction(fields: any): Promise<any> {
    const { transaction_type, initiator_name, initiator_bank, initiatingWallet } = fields;
    const transaction_id = UUID.generate();

    await knex("transaction").insert({
      id: transaction_id,
      transaction_type,
      initiator_name,
      initiator_bank,
      initiatingWallet
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
      initiatingWallet,
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
        initiatingWallet,
        receiver_name,
        receiver_bank,
        receiver_account
      })
      .where("transaction.id", transaction_id);
  }

  async createTransfer(fields: any): Promise<any> {
    const {
      transactionType,
      amount,
      status,
      initiator_name,
      initiator_bank,
      initiatingWallet,
      accountName,
      accountNumber,
      bankName
    } = fields;
    const transaction_id = UUID.generate();
    const created_at = new Date();

    await knex("transaction").insert({
      id: transaction_id,
      transaction_type: transactionType,
      amount: amount,
      status: status,
      initiator_name,
      initiator_bank,
      initiatingWallet,
      created_at: created_at
    });

    await knex("TnW").insert({
      transaction_id: transaction_id,
      bank: bankName,
      account_name: accountName,
      account_number: accountNumber
    });

    return { transaction_id: transaction_id, created_at: created_at };
  }

  async createWithdraw(fields: any): Promise<any> {
    const {
      transactionType,
      amount,
      status,
      initiator_name,
      initiator_bank,
      initiatingWallet,
      accountName,
      accountNumber,
      bankCode
    } = fields;
    const transaction_id = UUID.generate();
    const created_at = new Date();

    await knex("transaction").insert({
      id: transaction_id,
      transaction_type: transactionType,
      amount: amount,
      status: status,
      initiator_name,
      initiator_bank,
      initiatingWallet,
      created_at: created_at
    });

    await knex("TnW").insert({
      transaction_id: transaction_id,
      bank: bankCode,
      account_name: accountName,
      account_number: accountNumber
    });

    return { transaction_id: transaction_id, created_at: created_at };
  }

  async get_user_default_recepient(user_id: string): Promise<any> {
    const recipientData = await knex("customer_default_recipient")
      .join(
        "transfer_recipient",
        "transfer_recipient.id",
        "customer_default_recipient.transfer_recipient_id"
      )
      .select(
        "transfer_recipient.ps_recipient_code",
        "transfer_recipient.bank_account_number",
        "transfer_recipient.bank_account_name",
        "transfer_recipient.bank_code"
      )
      .where("customer_default_recipient.user_id", user_id)
      .first();

    return recipientData || null;
  }

  async get_recipient(account_number: string, bank_code: string): Promise<any> {
    const recipientData = await knex("transfer_recipient")
      .select()
      .where("transfer_recipient.bank_account_number", account_number)
      .andWhere("transfer_recipient.bank_code", bank_code)
      .first();

    return recipientData || null;
  }

  async create_recipient(recipientData: any): Promise<any> {
    const { bankCode, bankAccountNumber, bankAccountName, PSRecipientCode } = recipientData;

    const recipient = await knex("transfer_recipient").insert({
      bank_code: bankCode,
      bank_account_name: bankAccountName,
      bank_account_number: bankAccountNumber,
      ps_recipient_code: PSRecipientCode
    });
  }

  async updateWithdraw(transaction: any): Promise<void> {
    const { transaction_id, status } = transaction;

    await knex("transaction")
      .update({
        status
      })
      .where("transaction.id", transaction_id);
  }
}

export default KnexTransactionRepository;
