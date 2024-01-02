import Joi from "joi";
import AppException from "../AppException";
import { domainError } from "../domainError";

class TransactionValidation {
  private static completeFundSchema = Joi.object({
    ref: Joi.string().required()
  });

  private static wallet2WalletSchema = Joi.object({
    receiver_wallet_id: Joi.string().required(),
    amount: Joi.number().required()
  });

  private static wallet2OtherSchema = Joi.object({
    amount: Joi.number().required(),
    account_number: Joi.string().required(),
    bank_code: Joi.string().required()
  });

  public static async completeFund(requestData: any): Promise<any | void> {
    const { ref } = requestData;
    try {
      return await TransactionValidation.completeFundSchema.validateAsync({ ref });
    } catch (e) {
      const err: any = e;
      const message = err.message.replace(/\"/g, "");
      throw new AppException(domainError.INVALID_OR_MISSING_PARAMETER, message);
    }
  }

  public static async wallet2Wallet(requestData: any): Promise<any | void> {
    const { receiver_wallet_id, amount } = requestData;
    try {
      return await TransactionValidation.wallet2WalletSchema.validateAsync({
        receiver_wallet_id,
        amount
      });
    } catch (e) {
      const err: any = e;
      const message = err.message.replace(/\"/g, "");
      throw new AppException(domainError.INVALID_OR_MISSING_PARAMETER, message);
    }
  }

  public static async wallet2Other(requestData: any): Promise<any | void> {
    const { amount, bank_code, account_number } = requestData;
    try {
      return await TransactionValidation.wallet2OtherSchema.validateAsync({
        amount,
        bank_code,
        account_number
      });
    } catch (e) {
      const err: any = e;
      const message = err.message.replace(/\"/g, "");
      throw new AppException(domainError.INVALID_OR_MISSING_PARAMETER, message);
    }
  }
}

export default TransactionValidation;
