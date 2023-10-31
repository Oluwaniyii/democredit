import {
  DataTypes,
  Model,
  UUIDV4,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import { sequelize } from "../../../app/service-providers/sequelize";

class customerDefaultRecipient extends Model<
  InferAttributes<customerDefaultRecipient>,
  InferCreationAttributes<customerDefaultRecipient>
> {
  declare id: string;
  declare user_id: CreationOptional<string>;
  declare transfer_recipient_id: CreationOptional<number>;
}

customerDefaultRecipient.init(
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    transfer_recipient_id: {
      type: DataTypes.NUMBER
    }
  },
  {
    sequelize,
    modelName: "customerDefaultRecipient",
    tableName: "customer_default_recipient",
    createdAt: false,
    updatedAt: false
  }
);

export default customerDefaultRecipient;
