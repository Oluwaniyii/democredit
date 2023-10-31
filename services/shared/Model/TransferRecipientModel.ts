import {
  DataTypes,
  Model,
  UUIDV4,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import { sequelize } from "../../../app/service-providers/sequelize";

class TransferRecipient extends Model<
  InferAttributes<TransferRecipient>,
  InferCreationAttributes<TransferRecipient>
> {
  declare id: string;
  declare bank_code: CreationOptional<string>;
  declare bank_account_name: CreationOptional<string>;
  declare bank_account_number: CreationOptional<string>;
  declare ps_recipient_code: CreationOptional<string>;
  declare created_at: CreationOptional<string>;
}

TransferRecipient.init(
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true
    },
    bank_code: { type: DataTypes.STRING },
    bank_account_name: { type: DataTypes.STRING },
    bank_account_number: { type: DataTypes.STRING },
    ps_recipient_code: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE }
  },
  {
    sequelize,
    modelName: "TransferRecipient",
    tableName: "customer_default_recipient",
    createdAt: "created_at",
    updatedAt: false
  }
);

export default TransferRecipient;
