import ITransactionRepository from "./ITransactionRepository";
import Transaction from "./Transaction";
import TransactionModel from "../shared/Model/TransactionModel";
import TransactionFundModel from "../shared/Model/TransactionFundModel";
import TransactionWallet2WalletModel from "../shared/Model/TransactionWallet2WalletModel";

class TransactionRepository implements ITransactionRepository {
  async createTransactionFund(fields: any): Promise<any> {
    const { transactionType, initiatingWallet } = fields;

    const transactionData: any = await TransactionModel.create({
      transaction_type: transactionType,
      initiating_wallet: initiatingWallet
    });

    const tFundData = await TransactionFundModel.create({
      transaction_id: transactionData.id
    });

    return {
      id: transactionData.id,
      transactionType: transactionData.transaction_type,
      status: transactionData.status,
      initiatingWallet: transactionData.initiating_wallet,
      createdAt: transactionData.created_at
    };
  }

  async getTransactionFund(transaction_id: string): Promise<any> {
    const transactionData: any = await TransactionModel.findOne({ where: { id: transaction_id } });
    const transactionFundData = await TransactionFundModel.findOne({
      where: { transaction_id: transaction_id }
    });

    if (!transactionData || !transactionFundData) return null; //something went wrong

    return {
      id: transactionData.id,
      transactionType: transactionData.transaction_type,
      amount: transactionData.amount,
      status: transactionData.status,
      initiatingWallet: transactionData.initiating_wallet,
      transactionStatementId: transactionData.transaction_statement_id,
      created_at: transactionData.created_at,
      channel: transactionFundData.channel,
      authorizing_bank: transactionFundData.authorizing_bank
    };
  }

  async updateTransactionFund(transactionData: any): Promise<void> {
    const transactions = {
      transaction_type: transactionData.transactionType,
      amount: transactionData.amount,
      status: transactionData.status,
      initiatingWallet: transactionData.initiatingWallet
    };
    const tfund = {
      channel: transactionData.channel,
      authorizing_bank: transactionData.authorizing_bank
    };

    await TransactionModel.update(this.getDefinedFields(transactions), {
      where: { id: transactionData.id }
    });
    await TransactionFundModel.update(this.getDefinedFields(tfund), {
      where: { transaction_id: transactionData.id }
    });
  }

  async createTransactionWallet2Wallet(fields: any): Promise<any> {
    const transactionData = await TransactionModel.create({
      transaction_type: fields.transactionType,
      amount: fields.amount,
      status: fields.status,
      initiating_wallet: fields.initiatingWallet
    });

    const transactionW2WData = await TransactionWallet2WalletModel.create({
      transaction_id: transactionData.id,
      receiving_wallet_id: fields.receivingWallet
    });

    return {
      id: transactionData.id,
      transactionType: transactionData.transaction_type,
      amount: transactionData.amount,
      status: transactionData.status,
      initiatingWallet: transactionData.initiating_wallet,
      created_at: transactionData.created_at,
      receivingWallet: transactionW2WData.receiving_wallet_id
    };
  }

  async createTransactionWithdraw(fields: any): Promise<any> {}
  async updateTransactionWithdraw(fields: any): Promise<any> {}

  async createTransferRecipient(fields: any): Promise<any> {}
  async getDefaultTransferRecipient(fields: any): Promise<any> {}
  async getTransferRecipient(accountNumber: string, bankCode: string): Promise<any> {}

  private getDefinedFields = function(fields: any) {
    const definedFields: any = {};

    Object.keys(fields).forEach(key => {
      if (fields[key]) definedFields[key] = fields[key];
    });

    return definedFields;
  };
}

export default TransactionRepository;
