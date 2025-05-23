import { Response } from "express";

class AccountResponseFormat {
  public static getAccount(res: Response, actionData: any): Response {
    const { id, name, email, phone, created_at } = actionData.account;
    const { id: wallet_id } = actionData.wallet;

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "ok";
    const data: any = {};

    data["user"] = {};
    data["user"]["id"] = id;
    data["user"]["name"] = name;
    data["user"]["email"] = email;
    data["user"]["phone"] = phone;
    data["user"]["created_at"] = created_at;

    data["wallet"] = {};
    data["wallet"]["id"] = wallet_id;
    data["wallet"]["url"] = `/wallets/${wallet_id}`;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }

  public static signUp(res: Response, actionData: any): Response {
    const { id, name, email, phone, created_at } = actionData.account;
    const { id: wallet_id } = actionData.wallet;

    const response: any = {};
    const statusCode = 201;
    const success = true;
    const message = "account created successfully";
    const data: any = {};

    data["user"] = {};
    data["user"]["id"] = id;
    data["user"]["name"] = name;
    data["user"]["email"] = email;
    data["user"]["phone"] = phone;
    data["user"]["created_at"] = created_at;

    data["wallet"] = {};
    data["wallet"]["id"] = wallet_id;
    data["wallet"]["url"] = `/wallets/${wallet_id}`;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }

  public static signIn(res: Response, actionData: any): Response {
    const { account, session, wallet } = actionData;

    const { id: user_id, name, email, phone, created_at } = account;
    const { id: session_id, issued_at, expire_in } = session;
    const { id: wallet_id } = wallet;

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "logged in successfully";
    const data: any = {};

    data["user"] = {};
    data["user"]["id"] = user_id;
    data["user"]["name"] = name;
    data["user"]["email"] = email;
    data["user"]["phone"] = phone;
    data["user"]["created_at"] = created_at;

    data["wallet"] = {};
    data["wallet"]["id"] = wallet_id;
    data["wallet"]["url"] = `/wallets/${wallet_id}`;

    data["session"] = {};
    data["session"]["id"] = session_id;
    data["session"]["issued_at"] = issued_at;
    data["session"]["expire_in"] = expire_in;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }

  public static getAccountAllInfo(res: Response, accounts: any): Response {
    const account_list = accounts.map((account: any) => {
      const { account_id, account_name, account_email, wallet_id, wallet_balance } = account;
      return { account_id, account_name, account_email, wallet_id, wallet_balance };
    });

    const response: any = {};
    const statusCode = 200;
    const success = true;
    const message = "ok";
    const data: any = {};

    data["accounts"] = account_list;

    response.success = success;
    response.message = message;
    response.data = data;

    res.status(statusCode);
    res.json(response);

    return res;
  }
}

export default AccountResponseFormat;
