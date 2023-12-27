import {
  DataTypes,
  Model,
  UUIDV4,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import { sequelize } from "../../../app/service-providers/sequelize";

class Log extends Model<InferAttributes<Log>, InferCreationAttributes<Log>> {
  declare id: CreationOptional<number>;
  declare wallet_id: string;
  declare transaction_id: string;
  declare entry_type: string;
  declare amount: number;
  declare balance: number;
  declare description: CreationOptional<string>;
  declare created_at: CreationOptional<string>;
}

Log.init(
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true
    },
    wallet_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    entry_type: { type: DataTypes.STRING },
    amount: { type: DataTypes.NUMBER },
    balance: { type: DataTypes.NUMBER },
    description: { type: DataTypes.STRING, defaultValue: "" },
    created_at: { type: DataTypes.DATE }
  },
  {
    sequelize,
    modelName: "Log",
    tableName: "log",
    createdAt: "created_at",
    updatedAt: false
  }
);

export default Log;
