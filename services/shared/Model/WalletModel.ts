import {
  DataTypes,
  Model,
  UUIDV4,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import { sequelize } from "../../../app/service-providers/sequelize";

class Wallet extends Model<InferAttributes<Wallet>, InferCreationAttributes<Wallet>> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare balance: CreationOptional<number>;
  declare created_at: CreationOptional<string>;
  declare updated_at: CreationOptional<string>;
}

Wallet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    balance: {
      type: DataTypes.NUMBER,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    modelName: "wallet",
    tableName: "wallet",
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Wallet;
