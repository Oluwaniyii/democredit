import User from "./UserModel";
import Wallet from "./WalletModel";

User.hasOne(Wallet, { as: "wallet" });
Wallet.belongsTo(User, { as: "user", foreignKey: "user_id" });

export default {
  User,
  Wallet
};
