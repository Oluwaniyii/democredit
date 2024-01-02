import { Response } from "express";

class TransactionResponseFormat {
  public static initializeFund(res: Response, actionData: any): Response {
    const { paymentLink } = actionData;

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "ok";
    const data: any = {};

    data["fund"] = {};
    data["fund"]["payment_link"] = paymentLink;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }

  public static completeFund(res: Response, actionData: any): Response {
    const { transaction, wallet } = actionData;
    const { id: wallet_id, balance } = wallet;
    const {
      id,
      status,
      transactionType,
      amount,
      channel,
      created_at,
      authorizing_bank,
      initiator_name,
      initiatingWallet
    } = transaction;

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "ok";
    const data: any = {};

    data["transaction"] = {};
    data["transaction"]["id"] = id;
    data["transaction"]["transaction_type"] = transactionType;
    data["transaction"]["amount"] = amount;
    data["transaction"]["status"] = status;
    data["transaction"]["payment_channel"] = channel;
    data["transaction"]["initiatingWallet"] = initiatingWallet;
    data["transaction"]["created_at"] = created_at;

    data["wallet"] = {};
    data["wallet"]["id"] = wallet_id;
    data["wallet"]["balance"] = balance;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }

  public static wallet2wallet(res: Response, actionData: any): Response {
    const { transaction, wallet } = actionData;

    const { id: wallet_id, balance } = wallet;

    const {
      id,
      status,
      transactionType,
      amount,
      created_at,
      initiator_name,
      initiatingWallet,
      receivingWallet
    } = transaction;

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "ok";
    const data: any = {};

    data["transaction"] = {};
    data["transaction"]["id"] = id;
    data["transaction"]["transaction_type"] = transactionType;
    data["transaction"]["amount"] = amount;
    data["transaction"]["from"] = initiatingWallet;
    data["transaction"]["to"] = receivingWallet;
    data["transaction"]["status"] = status;
    data["transaction"]["created_at"] = created_at;

    data["wallet"] = {};
    data["wallet"]["id"] = wallet_id;
    data["wallet"]["balance"] = balance;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }

  public static wallet2other(res: Response, actionData: any): Response {
    const { transaction, wallet } = actionData;

    const { id: wallet_id, balance, accountName: walletName } = wallet;

    const {
      id,
      status,
      transactionType,
      amount,
      reason,
      created_at,
      initiator_name,
      initiatingWallet,
      accountName,
      accountNumber,
      bankCode
    } = transaction;

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "ok";
    const data: any = {};

    data["transaction"] = {};
    data["transaction"]["id"] = id;
    data["transaction"]["transaction_type"] = transactionType;
    data["transaction"]["amount"] = amount;
    data["transaction"]["initiator_name"] = walletName;
    data["transaction"]["initiator_wallet"] = initiatingWallet;
    data["transaction"]["beneficiary_name"] = accountName;
    data["transaction"]["beneficiary_bank"] = bankCode;
    data["transaction"]["beneficiary_account"] = accountNumber;
    data["transaction"]["status"] = status;
    data["transaction"]["reason"] = reason || "";
    data["transaction"]["created_at"] = created_at;

    data["wallet"] = {};
    data["wallet"]["id"] = wallet_id;
    data["wallet"]["balance"] = balance;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }

  public static getTransactionHistory(res: Response, actionData: any): Response {
    const { transactions, limit, page, totalCount } = actionData;

    const transaction_list = transactions.map((transaction: any) => {
      const {
        id,
        wallet_id,
        transaction_id,
        entry_type,
        amount,
        balance,
        description,
        created_at
      } = transaction;

      return {
        id,
        entry_type,
        amount,
        description,
        balance,
        transaction_url: `/transactions/${transaction_id}`,
        created_at
      };
    });

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "ok";
    const data: any = {};

    const PAGE_LINK = `/transactions?limit=${limit}&page=`;
    const LAST_PAGE = Math.ceil(totalCount / limit);

    data["pagination"] = {};
    data["pagination"]["limit"] = limit;
    data["pagination"]["page"] = page;
    data["pagination"]["totalRows"] = totalCount;
    data["pagination"]["next"] = page < LAST_PAGE ? `${PAGE_LINK}${page + 1}` : null;
    data["pagination"]["prev"] = page > 1 ? `${PAGE_LINK}${page - 1}` : null;
    data["pagination"]["last"] = `${PAGE_LINK}${LAST_PAGE}`;
    data["pagination"]["first"] = `${PAGE_LINK}1`;
    data["transactions"] = transaction_list;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }

  public static getTransaction(res: Response, actionData: any): Response {
    const { transactionType } = actionData;

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "ok";

    let data: any;

    if (transactionType === "WITHDRAW") data = TransactionResponseFormat.tt1(actionData);
    else if (transactionType === "TRANSFER") data = TransactionResponseFormat.tt2(actionData);
    else if (transactionType === "FUND") data = TransactionResponseFormat.tt3(actionData);

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }

  static tt1(s: any): any {
    const { transaction, recipient } = s;

    const {
      id,
      transactionType,
      amount,
      status,
      reason,
      initiatingWallet,
      created_at
    } = transaction;
    const { bank_code, bank_account_number, bank_account_name } = recipient;

    const data: any = {};

    data["transaction"] = {};
    data["transaction"]["id"] = id;
    data["transaction"]["transaction_type"] = transactionType;
    data["transaction"]["amount"] = amount;
    data["transaction"]["status"] = status;
    data["transaction"]["beneficiary_name"] = bank_account_name;
    data["transaction"]["beneficiary_bank"] = bank_code;
    data["transaction"]["beneficiary_account"] = bank_account_number;
    data["transaction"]["reason"] = reason || "";
    data["transaction"]["created_at"] = created_at;

    return data;
  }

  static tt2(s: any): any {
    const { transaction, wallet } = s;

    const {
      id,
      status,
      transactionType,
      amount,
      initiator_name,
      initiatingWallet,
      created_at
    } = transaction;
    const { id: wallet_id, accountName } = wallet;

    const data: any = {};

    data["transaction"] = {};
    data["transaction"]["id"] = id;
    data["transaction"]["transaction_type"] = transactionType;
    data["transaction"]["amount"] = amount;
    data["transaction"]["to"] = accountName;
    data["transaction"]["status"] = status;
    data["transaction"]["created_at"] = created_at;

    return data;
  }

  static tt3(s: any): any {
    const { transaction } = s;

    const {
      id,
      status,
      transactionType,
      amount,
      initiator_name,
      initiatingWallet,
      created_at,
      channel,
      authorizing_bank
    } = transaction;

    const data: any = {};

    data["transaction"] = {};
    data["transaction"]["id"] = id;
    data["transaction"]["transaction_type"] = transactionType;
    data["transaction"]["amount"] = amount;
    data["transaction"]["to"] = initiatingWallet;
    data["transaction"]["status"] = status;
    data["transaction"]["authorizing_bank"] = authorizing_bank || "N/A";
    data["transaction"]["payment_channel"] = channel || "N/A";
    data["transaction"]["created_at"] = created_at;

    return data;
  }
}

export default TransactionResponseFormat;
