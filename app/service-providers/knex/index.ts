import knex from "knex";
import config from "config";
import logger from "../../utils/logger";

let connection: any;

export async function connect() {
  try {
    knexConnection = knex({
      client: "mysql2",
      connection: {
        host: config.get("db.mysql.host"),
        port: config.get("db.mysql.port"),
        user: config.get("db.mysql.user"),
        password: config.get("db.mysql.password"),
        database: config.get("db.mysql.database")
      }
    });

    logger.info("knex connection successful");
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

export let knexConnection = connection;
