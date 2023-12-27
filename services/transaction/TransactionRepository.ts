import ITransactionRepository from "./ITransactionRepository";
import Transaction from "./Transaction";
import TransactionModel from "../shared/Model/TransactionModel";
import TransactionFundModel from "../shared/Model/TransactionFundModel";
import TransactionWallet2WalletModel from "../shared/Model/TransactionWallet2WalletModel";
import TransactionWallet2OtherModel from "../shared/Model/TransactionWallet2OtherModel";
import TransferRecipientModel from "../shared/Model/TransferRecipientModel";
import customerDefaultRecipient from "../shared/Model/CustomerDefaultRecipientModel";
import LogModel from "../shared/Model/LogModel";
import TransactionWallet2Other from "./TransactionWallet2Other";

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

  async createTransactionWallet2Other(fields: any): Promise<any> {
    const { transactionType, amount, initiatingWallet, transferRecipientId } = fields;

    const transactionData: any = await TransactionModel.create({
      transaction_type: transactionType,
      amount: amount,
      initiating_wallet: initiatingWallet
    });

    const tWallet2OtherData = await TransactionWallet2OtherModel.create({
      transaction_id: transactionData.id,
      transfer_recipient_id: transferRecipientId
    });

    return {
      id: transactionData.id,
      transactionType: transactionData.transaction_type,
      amount: transactionData.amount,
      status: transactionData.status,
      initiatingWallet: transactionData.initiating_wallet,
      created_at: transactionData.created_at
    };
  }

  async updateTransactionWallet2Other(fields: any): Promise<any> {
    const { id: transactionId, status, amount, initiatingWallet, transferRecipientId } = fields;
    await TransactionModel.update({ status: status }, { where: { id: transactionId } });
    await TransactionWallet2OtherModel.update(
      { transfer_recipient_id: transferRecipientId },
      { where: { transaction_id: transactionId } }
    );
  }

  async createTransferRecipient(fields: any): Promise<any> {
    const { bankCode, bankAccountNumber, bankAccountName, PSRecipientCode } = fields;

    const recipient = await TransferRecipientModel.create({
      bank_code: bankCode,
      bank_account_number: bankAccountNumber,
      bank_account_name: bankAccountName,
      ps_recipient_code: PSRecipientCode
    });

    return { id: recipient.id };
  }

  async getDefaultTransferRecipient(userId: string): Promise<any> {
    const defaultRecipient: any = await customerDefaultRecipient.findOne({
      where: { user_id: userId }
    });
    if (!defaultRecipient) return null;

    const transfer_recipient: any = await TransferRecipientModel.findOne({
      where: { id: defaultRecipient.transfer_recipient_id }
    });
    if (!transfer_recipient) return null;

    const {
      id,
      bank_code,
      bank_account_number,
      bank_account_name,
      ps_recipient_code,
      created_at
    } = transfer_recipient;

    return {
      id,
      bank_code,
      bank_account_number,
      bank_account_name,
      ps_recipient_code,
      created_at
    };
  }

  async getTransferRecipient(accountNumber: string, bankCode: string): Promise<any> {
    const transfer_recipient: any = await TransferRecipientModel.findOne({
      where: {
        bank_account_number: accountNumber,
        bank_code: bankCode
      }
    });

    if (!transfer_recipient) return null;

    const {
      id,
      bank_code,
      bank_account_number,
      bank_account_name,
      ps_recipient_code,
      created_at
    } = transfer_recipient;

    return {
      id,
      bank_code,
      bank_account_number,
      bank_account_name,
      ps_recipient_code,
      created_at
    };
  }

  async getTransferRecipientById(recipientId: string): Promise<any> {
    const transfer_recipient: any = await TransferRecipientModel.findOne({
      where: { id: recipientId }
    });

    if (!transfer_recipient) return null;

    const {
      id,
      bank_code,
      bank_account_number,
      bank_account_name,
      ps_recipient_code,
      created_at
    } = transfer_recipient;

    return {
      id,
      bank_code,
      bank_account_number,
      bank_account_name,
      ps_recipient_code,
      created_at
    };
  }

  async getTransactionHistory(walletId: string): Promise<Array<any>> {
    const transactions = await LogModel.findAll({ where: { wallet_id: walletId }, raw: true });
    return transactions;
  }

  async getTransactionType(transactionId: string): Promise<any> {
    const transaction = await TransactionModel.findOne({
      attributes: ["id", "transaction_type"],
      where: { id: transactionId },
      raw: true
    });
    if (!transaction) return null;

    return transaction.transaction_type;
  }

  async getTransaction(transactionId: string): Promise<any> {
    const transaction = await TransactionModel.findOne({
      attributes: ["id", "transaction_type"],
      where: { id: transactionId },
      raw: true
    });
    if (!transaction) return null;

    const transactionType = transaction.transaction_type.toUpperCase();
    let tr: any;

    switch (transactionType) {
      case "FUND":
        return this.getTransactionFund(transactionId);
      case "TRANSFER":
        return this.getTransactionWallet2Wallet(transactionId);
        tr = await this.getTransactionWallet2Wallet(transactionId);
        return tr;

      case "WITHDRAW":
        tr = await this.getTransactionWallet2Other(transactionId);
        tr.recipient = await this.getTransferRecipientById(tr.recipientId);
        return tr;
    }
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

  async getTransactionWallet2Wallet(transaction_id: string): Promise<any> {
    const transactionData: any = await TransactionModel.findOne({ where: { id: transaction_id } });
    const transactionW2WData = await TransactionWallet2WalletModel.findOne({
      where: { transaction_id: transaction_id }
    });

    if (!transactionData || !transactionW2WData) return null;

    return {
      id: transactionData.id,
      transactionType: transactionData.transaction_type,
      amount: transactionData.amount,
      status: transactionData.status,
      initiatingWallet: transactionData.initiating_wallet,
      transactionStatementId: transactionData.transaction_statement_id,
      created_at: transactionData.created_at,
      receivingWallet: transactionW2WData.receiving_wallet_id
    };
  }

  async getTransactionWallet2Other(transaction_id: string): Promise<any> {
    const transactionData: any = await TransactionModel.findOne({ where: { id: transaction_id } });
    const transactionW2OData = await TransactionWallet2OtherModel.findOne({
      where: { transaction_id: transaction_id }
    });

    if (!transactionData || !transactionW2OData) return null;

    return {
      id: transactionData.id,
      transactionType: transactionData.transaction_type,
      amount: transactionData.amount,
      status: transactionData.status,
      initiatingWallet: transactionData.initiating_wallet,
      transactionStatementId: transactionData.transaction_statement_id,
      created_at: transactionData.created_at,
      recipientId: transactionW2OData.transfer_recipient_id
    };
  }

  async writeLog(
    walletId: string,
    transactionId: string,
    amount: number,
    entryType: string,
    balance: number,
    description: string = ""
  ): Promise<void> {
    await LogModel.create({
      wallet_id: walletId,
      transaction_id: transactionId,
      entry_type: entryType,
      amount: amount,
      balance: balance,
      description: description
    });
  }

  private getDefinedFields = function(fields: any) {
    const definedFields: any = {};

    Object.keys(fields).forEach(key => {
      if (fields[key]) definedFields[key] = fields[key];
    });

    return definedFields;
  };
}

export default TransactionRepository;
