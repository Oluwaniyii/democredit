# DemoCredit

<img src="https://github.com/Oluwaniyii/democredit/blob/main/_readme/democredit_paystack_dash.png?raw=true" alt="">

## Version: 1.0.0

### /accounts

#### POST

##### Summary:

Create Account

##### Description:

## Create Account

This endpoint allows you to create a new account.

A wallet will be automaticallly created for the new account as well

### Request Body

- `name` (text, required): The name of the user.
- `email` (text, required): The email address of the user.
- `phone` (text, required): The phone number of the user.
- `password` (text, required): The password for the account.

### Response

- `success` (boolean): Indicates if the account creation was successful.
- `message` (string): A message indicating the status of the account creation.
- `data` (object): An object containing user and wallet information.
  - `user` (object): Details of the user created.
    - `id` (string): The unique identifier of the user.
    - `name` (string): The name of the user.
    - `email` (string): The email address of the user.
    - `phone` (string): The phone number of the user.
    - `created_at` (string): The timestamp of when the user account was created.
  - `wallet` (object): Details of the user's wallet.
    - `id` (string): The unique identifier of the wallet.
    - `url` (string): The URL to access the user's wallet.

##### Responses

| Code | Description             |
| ---- | ----------------------- |
| 201  | Success                 |
| 400  | Error: Registered Email |

### /accounts/signin

#### POST

##### Summary:

Signin Account

##### Description:

This endpoint is used to sign in to the user's account. The HTTP POST request should be made to {{baseUrl}}/accounts/signin with the user's email and password provided in the raw request body.

**NOTE**:

- This is a slightly faux sign-in feature. Any password value with a correct email will grant you access, while a wrong email will return an invalid credential response. This gives you options to log into another wallet and test all over if you want

### Request Body

- email (string): The user's email address
- password (string): The user's password

### Response

- success (boolean): Indicates if the login was successful
- message (string): A message confirming the status of the login
- data (object): An object containing user details, wallet information, and session details
  - user (object): Details of the signed-in user
    - id (string): The user's unique identifier
    - name (string): The user's name
    - email (string): The user's email address
    - phone (string): The user's phone number
    - created_at (string): The date and time of user account creation
  - wallet (object): Information about the user's wallet
    - id (string): The wallet's unique identifier
    - url (string): The URL to access the user's wallet
  - session (object): Details of the user's session
    - id (string): The session ID
    - issued_at (number): The timestamp when the session was issued
    - expire_in (number): The duration of the session's validity in milliseconds

##### Responses

| Code | Description              |
| ---- | ------------------------ |
| 200  | Success                  |
| 401  | Error: Wrong Credentials |

### /accounts/{account_id}

#### GET

##### Summary:

Get Account

##### Description:

# Get Account Details

This endpoint retrieves the details of a specific account identified by the `account_id`.

### Request

- Method: `GET`
- URL: `{{baseUrl}}/accounts/{account_id}`

### Response

- `success`: Indicates if the request was successful.
- `message`: A message indicating the status of the request.
- `data.user`: An object containing details of the user associated with the account.
  - `id`: The unique identifier of the user.
  - `name`: The name of the user.
  - `email`: The email address of the user.
  - `phone`: The phone number of the user.
  - `created_at`: The timestamp indicating when the user account was created.
- `data.wallet`: An object containing details of the wallet associated with the account.
  - `id`: The unique identifier of the wallet.
  - `url`: The URL for accessing the wallet details.

##### Parameters

| Name       | Located in | Description | Required | Schema |
| ---------- | ---------- | ----------- | -------- | ------ |
| account_id | path       |             | Yes      | string |

##### Responses

| Code | Description      |
| ---- | ---------------- |
| 200  | Success          |
| 400  | Error: Not Found |

### /wallets/{wallet_id}

#### GET

##### Summary:

get wallet

##### Description:

# Get Wallet Details

This endpoint retrieves the details of a specific wallet identified by its ID.

## Request

### Request URL

- Method: GET
- URL: `{{baseUrl}}/wallets/{wallet_id}`

## Response

- `success`: Indicates if the request was successful.
- `message`: A message providing additional information about the request.
- `data.wallet.id`: The unique identifier of the wallet.
- `data.wallet.balance`: The current balance of the wallet.
- `data.wallet.name`: The name associated with the wallet.

### Example Response

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "wallet": {
      "id": "e4c4888e-6602-4127-8930-2f415198c327",
      "balance": 0,
      "name": "Apollo Creed"
    }
  }
}
```

##### Parameters

| Name      | Located in | Description | Required | Schema |
| --------- | ---------- | ----------- | -------- | ------ |
| wallet_id | path       |             | Yes      | string |

##### Responses

| Code | Description      |
| ---- | ---------------- |
| 200  | Success          |
| 400  | Error: Not Found |

### /support/verify-account

#### POST

##### Summary:

Verify Account Details

##### Description:

This HTTP POST request is used to verify a user's account details. The request should be sent to {{baseUrl}}/support/verify-account with a payload in raw JSON format including the "account_number" and "bank_code" parameters.

### Request Body

- `account_number` (string): The account number to be verified.
- `bank_code` (string): The bank code associated with the account.

### Response

- `success` (boolean): Indicates if the request was successful.
- `message` (string): A message providing information about the request status.
- `data` (object): An object containing the verified account details.
  - `account_number` (string): The verified account number.
  - `account_name` (string): The name associated with the verified account.

#### Example

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "account_number": "0423703103",
    "account_name": "AYODELE OLUWANIYI BENJAMIN"
  }
}
```

##### Responses

| Code | Description          |
| ---- | -------------------- |
| 200  | Success              |
| 400  | Error: Invalid NUBAN |

### /support/banks

#### GET

##### Summary:

Get Bank Code Lists

##### Description:

This endpoint makes an HTTP GET request to retrieve a list of banks for support. The request does not include a request body.

### Possible API Responses

The API will respond with a list of banks for support, including details such as bank names, codes, and other relevant information.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /transactions/fund

#### POST

##### Summary:

initialize fund

##### Description:

### POST /transactions/fund

This endpoint is used to initiate a fund transaction.

NOTE:  
The response will return a payment link which you need to follow to complete funding your wallet

This project is in test mode so only card payment is available, where you can try both decline and accept to test the behaviours

Do not close the payment dropdown if you don't attempt for an action (accept or decline) otherwise you get a duplicate transaction error and will need to generate a new fund link

#### Response

- `success` (boolean): Indicates if the transaction was successful.
- `message` (string): A message providing additional information about the transaction.
- `data` (object)
  - `fund` (object)
    - `payment_link` (string): The URL for the payment link to complete the fund transaction.

#### Example

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "fund": {
      "payment_link": "http://localhost:3000/pg/transaction/fund?ref=tr_d158373b-3612-44eb-a493-50d96e2ecfa4&email=teejohnson@gmail.com"
    }
  }
}
```

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /transactions/transfer

#### POST

##### Summary:

Transfer 2 Wallet

##### Description:

### Transfer 2 Wallet

This endpoint allows you to initiate a transfer transaction between two wallets.

- Request Body Parameters:
  - `amount` (number): The amount to be transferred.
  - `receiver_wallet_id` (string): The ID of the wallet to which the amount is to be transferred.

#### Response

- `success` (boolean): Indicates if the transaction was successful.
- `message` (string): A message providing additional information about the transaction.
- `data` (object):
  - `transaction` (object):
    - `id` (string): The ID of the transaction.
    - `transaction_type` (string): The type of transaction, which is "TRANSFER" in this case.
    - `amount` (number): The amount that was transferred.
    - `from` (string): The ID of the wallet from which the amount was transferred.
    - `to` (string): The ID of the wallet to which the amount was transferred.
    - `status` (string): The status of the transaction, which can be "SUCCESS" or "FAILED".
  - `wallet` (object):
    - `id` (string): The ID of the wallet involved in the transaction.
    - `balance` (number): The updated balance of the wallet after the transaction.

##### Responses

| Code | Description                               |
| ---- | ----------------------------------------- |
| 200  | success                                   |
| 400  | Insufficient Funds / Error: Self Transfer |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /transactions/withdraw

#### POST

##### Summary:

Transfer 2 Bank

##### Description:

## Withdraw Transaction

This API endpoint allows you to initiate a withdrawal transaction.

**NOTE**:

This is test mode so no real money is being sent.

It is completely safe to use bank account details

### Request Body

- `bank_code` (string): The code of the bank where the withdrawal will be made.
- `account_number` (string): The account number from which the withdrawal will be made.
- `account_name` (string): The name associated with the account.
- `amount` (number): The amount to be withdrawn.

### Response

- `success` (boolean): Indicates if the transaction was successful.
- `message` (string): Describes the result of the transaction.
- `data.transaction` (object): Contains details of the withdrawal transaction.
  - `id` (string): The unique identifier for the transaction.
  - `transaction_type` (string): Indicates the type of transaction (e.g., WITHDRAW).
  - `amount` (number): The amount withdrawn.
  - `initiator_name` (string): The name of the initiator of the transaction.
  - `initiator_wallet` (string): The wallet ID of the initiator.
  - `beneficiary_name` (string): The name of the beneficiary.
  - `beneficiary_bank` (string): The code of the beneficiary's bank.
  - `beneficiary_account` (string): The account number of the beneficiary.
  - `status` (string): The status of the transaction (e.g., SUCCESS).
  - `reason` (string): The reason for the transaction status, if any.
- `data.wallet` (object): Contains details of the initiator's wallet.
  - `id` (string): The unique identifier for the wallet.
  - `balance` (number): The updated balance in the wallet after the withdrawal.

##### Responses

| Code | Description   |
| ---- | ------------- |
| 200  | success       |
| 400  | invalid nuban |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /transactions

#### GET

##### Summary:

Get Transactions History

##### Description:

This API endpoint provides a list of transactions relating to the signed in user wallet with pagination support

### Request Parameters

- `limit` (integer): Specifies the number of transactions to be included per page.
- `page` (integer): Indicates the page number of the transactions to be retrieved.

### Response

### Pagination

The response includes pagination information to help navigate through the transaction records.

#### Pagination Fields

- `limit` (integer): The maximum number of transactions returned per page.
- `page` (integer): The current page number.
- `totalRows` (integer): The total number of transactions across all pages.
- `next` (string): URL for the next page of transactions.
- `prev` (string): URL for the previous page of transactions.
- `first` (string): URL for the first page of transactions.
- `last` (string): URL for the last page of transactions.

### Transaction Fields

Each transaction in the `transactions` array has the following fields:

- `id` (integer): The unique identifier for the transaction.
- `entry_type` (string): The type of entry, either "DEBIT" or "CREDIT".
- `amount` (string): The transaction amount.
- `description` (string): A description of the transaction, including details about the involved party.
- `balance` (string): The account balance after the transaction.
- `transaction_url` (string): URL to access detailed information about the transaction.
- `created_at` (string, ISO 8601 date-time format): The timestamp indicating when the transaction was created.

If there are no transactions matching the query parameters, an empty array will be returned

### Example Response

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "pagination": {
      "limit": 5,
      "page": 2,
      "totalRows": 18,
      "next": "/transactions?limit=5&page=3",
      "prev": "/transactions?limit=5&page=1",
      "last": "/transactions?limit=5&page=4",
      "first": "/transactions?limit=5&page=1"
    },
    "transactions": [
      {
        "id": 12,
        "entry_type": "DEBIT",
        "amount": "30",
        "description": "wallet transfer to Tee Johnson 4ef28a3d-2fe0-489e-bd7f-dc820509d075",
        "balance": "5210",
        "transaction_url": "/transactions/efadce87-4a77-4f6c-a992-6ea3e50977b5",
        "created_at": "2024-01-01T16:59:49.000Z"
      }
      // ... additional transactions ...
    ]
  }
}
```

### Notes

- The `amount` and `balance` fields are represented as strings to maintain precision.
- The `created_at` field follows the ISO 8601 date-time format.
- Use the pagination URLs to navigate through the transaction records.

##### Parameters

| Name  | Located in | Description | Required | Schema |
| ----- | ---------- | ----------- | -------- | ------ |
| limit | query      |             | No       | string |
| page  | query      |             | No       | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /transactions/{transaction_id}

#### GET

##### Summary:

Get Transaction

##### Description:

### Overview

The "Get Transaction" route provides detailed information about different types of transactions. The format of the response varies based on the `transaction_type` field in the response.

### Common Fields

All transaction responses include the following common fields:

- `success` (boolean): Indicates whether the API request was successful.
- `message` (string): A message providing additional information about the request outcome.
- `data` (object): Contains the transaction-specific information.

### Transfer Transaction

#### Type: "TRANSFER"

- `id` (string): The unique identifier for the transaction.
- `transaction_type` (string): The type of transaction, which is "TRANSFER".
- `amount` (integer): The transfer amount.
- `to` (string): The recipient's name.
- `status` (string): The status of the transfer, e.g., "SUCCESS".
- `created_at` (string, ISO 8601 date-time format): The timestamp indicating when the transfer was created.

Example Response:

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "transaction": {
      "id": "9d147c6c-e2be-48a7-a11f-91198a46f465",
      "transaction_type": "TRANSFER",
      "amount": 30,
      "to": "Tee Johnson",
      "status": "SUCCESS",
      "created_at": "2023-12-08T18:11:39.000Z"
    }
  }
}
```

### Withdraw Transaction

#### Type: "WITHDRAW"

- `id` (string): The unique identifier for the transaction.
- `transaction_type` (string): The type of transaction, which is "WITHDRAW".
- `amount` (integer): The withdrawal amount.
- `status` (string): The status of the withdrawal, e.g., "SUCCESS".
- `beneficiary_name` (string): The name of the beneficiary.
- `beneficiary_bank` (string): The code identifying the beneficiary's bank.
- `beneficiary_account` (string): The account number of the beneficiary.
- `reason` (string): A description or reason for the withdrawal (may be empty).
- `created_at` (string, ISO 8601 date-time format): The timestamp indicating when the withdrawal was created.

Example Response:

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "transaction": {
      "id": "a0eabec3-263e-4909-8b6a-8dd753c399d3",
      "transaction_type": "WITHDRAW",
      "amount": 200,
      "status": "SUCCESS",
      "beneficiary_name": "MBA VIOLET OBETTA",
      "beneficiary_bank": "044",
      "beneficiary_account": "0782823134",
      "reason": "",
      "created_at": "2024-01-01T17:35:55.000Z"
    }
  }
}
```

### Fund Transaction

#### Type: "FUND"

- `id` (string): The unique identifier for the transaction.
- `transaction_type` (string): The type of transaction, which is "FUND".
- `amount` (integer): The fund transfer amount.
- `to` (string): The identifier of the recipient.
- `status` (string): The status of the fund transfer, e.g., "SUCCESS".
- `authorizing_bank` (string): The name of the authorizing bank.
- `payment_channel` (string): The payment channel used for the fund transfer, e.g., "card".
- `created_at` (string, ISO 8601 date-time format): The timestamp indicating when the fund transfer was created.

Example Response:

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "transaction": {
      "id": "9b58d0d7-b623-42c9-ac59-8c33588bc657",
      "transaction_type": "FUND",
      "amount": 700,
      "to": "73ace0d7-c9e5-4ce2-b63b-343478a727c2",
      "status": "SUCCESS",
      "authorizing_bank": "TEST BANK",
      "payment_channel": "card",
      "created_at": "2023-12-08T18:29:40.000Z"
    }
  }
}
```

### Notes

- The `amount` field is represented as an integer for all transaction types.
- The `created_at` field follows the ISO 8601 date-time format for all transaction types.

##### Parameters

| Name           | Located in | Description | Required | Schema |
| -------------- | ---------- | ----------- | -------- | ------ |
| transaction_id | path       |             | Yes      | string |

##### Responses

| Code | Description                               |
| ---- | ----------------------------------------- |
| 200  | Type TRANSFER / Type WITHDRAW / Type FUND |
| 400  | Error: Not Found                          |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /

#### GET

##### Summary:

Home

##### Description:

This endpoint is used to retrieve a welcome message from the Democredit API. The HTTP GET request does not require any request body. Upon successful execution, the API will respond with a welcome message "Welcome to Democredit API".

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | OK          |
