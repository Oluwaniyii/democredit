import {
  DataTypes,
  Model,
  UUIDV4,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import { sequelize } from "../../../app/service-providers/sequelize";

class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  declare id: CreationOptional<string>;
  declare transaction_type: CreationOptional<string>;
  declare amount: CreationOptional<number>;
  declare status: CreationOptional<string>;
  declare initiating_wallet: CreationOptional<string>;
  declare transaction_statement_id: CreationOptional<number>;
  declare created_at: CreationOptional<string>;
  declare updated_at: CreationOptional<string>;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    transaction_type: {
      type: DataTypes.ENUM("FUND", "TRANSFER", "WITHDRAW")
    },
    amount: {
      type: DataTypes.NUMBER
    },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
      defaultValue: "PENDING"
    },
    initiating_wallet: { type: DataTypes.STRING },
    transaction_statement_id: { type: DataTypes.NUMBER },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE }
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "transaction",
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Transaction;
