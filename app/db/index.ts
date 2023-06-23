import { connect as sequelizeConnect } from "../service-providers/sequelize";
import { connect as knexConnect } from "../service-providers/knex";

function dbConnect(): void {
  knexConnect();
}

export default dbConnect;
