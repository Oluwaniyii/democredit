import {
  DataTypes,
  Model,
  UUIDV4,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import { sequelize } from "../../../app/service-providers/sequelize";

class TransactionWallet2Wallet extends Model<
  InferAttributes<TransactionWallet2Wallet>,
  InferCreationAttributes<TransactionWallet2Wallet>
> {
  declare transaction_id: string;
  declare receiving_wallet_id: CreationOptional<string>;
}

TransactionWallet2Wallet.init(
  {
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    receiving_wallet_id: { type: DataTypes.UUID, allowNull: false }
  },
  {
    sequelize,
    modelName: "TransactionWallet2Wallet",
    tableName: "t_wallet2wallet",
    createdAt: false,
    updatedAt: false
  }
);

export default TransactionWallet2Wallet;
