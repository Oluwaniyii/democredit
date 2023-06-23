import { Sequelize } from "sequelize";
import config from "config";
import logger from "../../utils/logger";

export const sequelize = new Sequelize(
  config.get("db.mysql.database"),
  config.get("db.mysql.user"),
  config.get("db.mysql.password"),
  {
    host: config.get("db.mysql.host"),
    port: config.get("db.mysql.port"),
    dialect: "mysql",
    define: {
      freezeTableName: true
    }
  }
);

function onSIGINT() {
  sequelize.close();
}

export async function connect() {
  try {
    await sequelize.authenticate();
    logger.info("debug", "Connection has been established successfully");
  } catch (e) {
    logger.error("Unable to connect to the database:", e);
    process.exit(1);
  }

  process.on("SIGINT", onSIGINT);
}
