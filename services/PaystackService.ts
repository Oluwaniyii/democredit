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
  public async verifyTransaction(transactionReference: string): Promise<any> {
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
}

export default PaystackService;
