import Joi from "joi";
import AppException from "../AppException";
import { domainError } from "../domainError";
const PHONE_FORMAT_REGEXP = /(\d{11})|(\d{10})|(\d{3}-\d{3}-\d{4})|(234\d{10})|(234-\d{3}-\d{3}-\d{4})|(\+234\d{10})|(\+234-\d{3}-\d{3}-\d{4})/;

const signinSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
});

const signupSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string()
    .regex(PHONE_FORMAT_REGEXP)
    .required(),
  password: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
});

export async function signIn(requestData: any): Promise<any | void> {
  const { email, password } = requestData;
  try {
    return await signinSchema.validateAsync({ email, password });
  } catch (e) {
    const err: any = e;
    const message = err.message.replace(/\"/g, "");
    throw new AppException(domainError.INVALID_OR_MISSING_PARAMETER, message);
  }
}

export async function signUp(requestData: any): Promise<any | void> {
  const { name, email, phone, password } = requestData;
  try {
    return await signupSchema.validateAsync({ name, email, phone, password });
  } catch (e) {
    const err: any = e;
    const message = err.message.replace(/\"/g, "");
    throw new AppException(domainError.INVALID_OR_MISSING_PARAMETER, message);
  }
}
