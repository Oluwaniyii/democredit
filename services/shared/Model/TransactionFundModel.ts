import {
  DataTypes,
  Model,
  UUIDV4,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import { sequelize } from "../../../app/service-providers/sequelize";

class TransactionFund extends Model<
  InferAttributes<TransactionFund>,
  InferCreationAttributes<TransactionFund>
> {
  declare transaction_id: string;
  declare channel: CreationOptional<string>;
  declare authorizing_bank: CreationOptional<string>;
}

TransactionFund.init(
  {
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    channel: { type: DataTypes.STRING },
    authorizing_bank: { type: DataTypes.STRING }
  },
  {
    sequelize,
    modelName: "TransactionFund",
    tableName: "t_fund",
    createdAt: false,
    updatedAt: false
  }
);

export default TransactionFund;
