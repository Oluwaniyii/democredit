import {
  DataTypes,
  Model,
  UUIDV4,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import { sequelize } from "../../../app/service-providers/sequelize";

class TransactionStatement extends Model<
  InferAttributes<TransactionStatement>,
  InferCreationAttributes<TransactionStatement>
> {
  declare id: string;
  declare statement: CreationOptional<string>;
  declare created_at: CreationOptional<string>;
}

TransactionStatement.init(
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true
    },
    statement: {
      type: DataTypes.TEXT
    },
    created_at: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    modelName: "TransactionStatement",
    tableName: "transaction_statement",
    createdAt: "created_at",
    updatedAt: false
  }
);

export default TransactionStatement;
