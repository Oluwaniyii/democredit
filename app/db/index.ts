import { connect as sequelizeConnect } from "../service-providers/sequelize";
import { connect as knexConnect } from "../service-providers/knex";

function dbConnect(): void {
  sequelizeConnect();
}

export default dbConnect;
