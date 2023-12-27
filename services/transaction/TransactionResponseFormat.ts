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
}

export default TransactionResponseFormat;
