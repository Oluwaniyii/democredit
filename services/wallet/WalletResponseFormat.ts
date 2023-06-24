import { Response } from "express";

class WalletResponseFormat {
  public static getWallet(res: Response, actionData: any): Response {
    const { id, balance, accountName } = actionData.wallet;

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "ok";
    const data: any = {};

    data["wallet"] = {};
    data["wallet"]["id"] = id;
    data["wallet"]["balance"] = balance;
    data["wallet"]["name"] = accountName;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }

  public static createWallet(res: Response, actionData: any): Response {
    const { id, balance } = actionData.wallet;

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "ok";
    const data: any = {};

    data["wallet"] = {};
    data["wallet"]["id"] = id;
    data["wallet"]["balance"] = balance;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }

  public static getWalletInfo(res: Response, actionData: any): Response {
    const { id, balance, userId, userName, userEmail } = actionData.wallet;

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "ok";
    const data: any = {};

    data["wallet_info"] = {};
    data["wallet_info"]["wallet_id"] = id;
    data["wallet_info"]["wallet_balance"] = balance;
    data["wallet_info"]["user_id"] = userId;
    data["wallet_info"]["user_name"] = userName;
    data["wallet_info"]["user_email"] = userEmail;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }
}

export default WalletResponseFormat;
