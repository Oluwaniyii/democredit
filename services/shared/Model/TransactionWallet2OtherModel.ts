import {
  DataTypes,
  Model,
  UUIDV4,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import { sequelize } from "../../../app/service-providers/sequelize";

class TransactionWallet2Other extends Model<
  InferAttributes<TransactionWallet2Other>,
  InferCreationAttributes<TransactionWallet2Other>
> {
  declare transaction_id: string;
  declare transfer_recipient_id: CreationOptional<string>;
}

TransactionWallet2Other.init(
  {
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    transfer_recipient_id: { type: DataTypes.NUMBER }
  },
  {
    sequelize,
    modelName: "TransactionWallet2Other",
    tableName: "t_wallet2other",
    createdAt: false,
    updatedAt: false
  }
);

export default TransactionWallet2Other;
