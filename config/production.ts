import { config } from "dotenv";
config();

export default {
  app: {
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 3000,
    baseURL:
      process.env.HOME_URL ||
      `${process.env.PROTOCOL || "http"}://${process.env.HOST || "localhost"}:${process.env.PORT ||
        3000}`,
    logging: {
      file: true
    }
  },
  db: {
    mysql: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    }
  },
  sentry: {
    dsn: process.env.SENTRY_DSN
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret"
  },
  paystack: {
    secret: process.env.PAYSTACK_SECRET_KEY,
    public: process.env.PAYSTACK_PUBLIC_KEY
  }
};
