import IPaystackService from "./IPaystackService";
import axios from "axios";
import config from "config";
import logger from "../app/utils/logger";
import { domainError } from "./domainError";
import AppException from "./AppException";

const PAYSTACK_SECRET_KEY = config.get("paystack.secret");

type axiosResponseType = {
  success: boolean;
  status: string | number;
  data: any;
};

async function axiosCall(requestObject: any): Promise<axiosResponseType> {
  const response: any = {};
  try {
    const d: any = await axios(requestObject);
    response.success = true;
    response.status = d.status;
    response.data = d.data;
    return response;
  } catch (error) {
    const e: any = error;

    response.success = false;
    response.status = e.response.status;
    response.data = e.response.data;

    logger.error(e);
    return response;
  }
}

class PaystackService implements IPaystackService {
  async listBankCodes(country: string = "nigeria"): Promise<any> {
    const response: axiosResponseType = await axiosCall({
      method: "get",
      url: `https://api.paystack.co/bank?country=${country}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    });

    if (!response.success)
      throw new AppException(
        domainError.TRANSACTION_FAILURE,
        "oops! we cannot resolve this request at this moment"
      );
    return response.data.data;
  }

  async resolveAccountDetails(account_number: string, bank_code: string): Promise<any> {
    const response: axiosResponseType = await axiosCall({
      method: "get",
      url: `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    });

    if (!response.success)
      throw new AppException(
        domainError.TRANSACTION_FAILURE,
        "provided recipient is not a valid nuban account"
      );
    return response.data.data;
  }

  async createTransferRecepient(
    bank_code: string,
    account_number: string,
    account_name: string
  ): Promise<any> {
    const response: axiosResponseType = await axiosCall({
      method: "post",
      url: `https://api.paystack.co/transferrecipient`,
      data: {
        type: "nuban",
        name: account_name,
        account_number: account_number,
        bank_code: bank_code,
        currency: "NGN"
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    });

    if (!response.success) throw new Error("error creating paystack recipient");
    return response.data.data;
  }

  async verifyTransaction(transactionReference: string): Promise<any> {
    const response: axiosResponseType = await axiosCall({
      method: "get",
      url: `https://api.paystack.co/transaction/verify/${transactionReference}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    });

    if (!response.success) throw new AppException(domainError.TRANSACTION_FAILURE);
    return response.data;
  }

  async initiateTransfer(amount: number, reference: string, recipient: string, reason: string) {
    /* 
    await axiosCall({
      method: "post",
      url: `https://api.paystack.co/transfer`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      },
      data: JSON.stringify({
        source: "balance",
        amount: amount,
        reference: reference,
        recipient: recipient,
        reason: reason
      })
    }); 
    */

    const response: any = {
      status: true,
      message: "Transfer retrieved",
      data: {
        integration: 119333,
        recipient: {
          domain: "test",
          type: "nuban",
          currency: "NGN",
          name: "Zombie",
          details: {
            account_number: "0100000001",
            account_name: null,
            bank_code: "044",
            bank_name: "Access Bank"
          },
          description: reason,
          metadata: "",
          recipient_code: recipient,
          active: true,
          email: null,
          id: 31911,
          integration: 119333,
          createdAt: "2017-10-13T20:35:51.000Z",
          updatedAt: "2017-10-13T20:35:51.000Z"
        },
        domain: "test",
        amount: amount,
        currency: "NGN",
        reference: "ref_demo",
        source: "balance",
        source_details: null,
        reason: reason,
        status: "success",
        failures: null,
        transfer_code: reference,
        titan_code: null,
        transferred_at: null,
        id: 476948,
        createdAt: "2018-07-22T10:29:33.000Z",
        updatedAt: "2018-07-22T10:29:33.000Z"
      }
    };

    return response.data;
  }
}

export default PaystackService;
