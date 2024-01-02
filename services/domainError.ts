// Request Errors: wrong request, parameters, request body, headers => 1001+
// Authentication Errors: Verifiying an identity, authorizing an action => 1101+
// Session Errors: You as a logged in entity, access, permissions, restrictions you bear(as defined in you session) => 1201+

// --------- Application Error
// Transaction Errors: Errors concerning transaction => 1301+
// Wallet Errors: Errors concerning transaction => 1401+

// Other Errors: => 1501+

export type TypeDomainError = {
  errorCode: number | string;
  statusCode: number | string;
  message: string;
};

export const domainError = {
  NOT_FOUND: {
    errorCode: 1001,
    statusCode: 400,
    message: "resource not found"
  },

  INVALID_OR_MISSING_PARAMETER: {
    errorCode: 1002,
    statusCode: 400,
    message: "invalid or missing parameter"
  },

  INVALID_OR_MISSING_HEADER: {
    errorCode: 1003,
    statusCode: 400,
    message: "invalid or missing header"
  },

  INVALID_CREDENTIALS: {
    errorCode: 1101,
    statusCode: 401,
    message: "invalid credentials"
  },

  INVALID_RESFRESH_TOKEN: {
    errorCode: 1102,
    statusCode: 401,
    message: "invalid refresh token"
  },

  UNAVAILABLE_EMAIL_ADDRESS: {
    errorCode: 1103,
    statusCode: 400,
    message: "email is not available"
  },

  INVALID_TRANSACTION_REFERENCE: {
    errorCode: 1301,
    statusCode: 400,
    message: "transaction reference is either invalid or missing"
  },

  TRANSACTION_FAILURE: {
    errorCode: 1302,
    statusCode: 400,
    message: "could not complete transaction at this time"
  },

  DUPLICATE_TRANSACTION: {
    errorCode: 1303,
    statusCode: 400,
    message: "duplicate transaction"
  },

  INVALID_WALLET_ID: {
    errorCode: 1401,
    statusCode: 400,
    message: "wallet does not exist, crosscheck provided id"
  },

  WALLET_DEPOSIT_ERROR: {
    errorCode: 1402,
    statusCode: 400,
    message: "could not deposit to wallet, input a valid amount"
  },

  WALLET_WITHDRAW_ERROR: {
    errorCode: 1404,
    statusCode: 400,
    message:
      "could not withdraw from wallet, this could be a result of invalid amount or insufficient funds"
  },

  SELF_TRANSFER: {
    errorCode: 1405,
    statusCode: 400,
    message: "you cannot transfer to yourself!"
  }
};
