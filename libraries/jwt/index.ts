import jwt from "jsonwebtoken";
import logger from "../../app/utils/logger";
import config from "config";

const JWT_SECRET: string = config.get("jwt.secret");

class JWT {
  public static async sign(payload: any) {
    try {
      return jwt.sign(payload, JWT_SECRET);
    } catch (error) {
      throw error;
    }
  }

  public static async decode(token: string) {
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      const error: any = e;
      if (error.message && error.message === "invalid signature") logger.error(error);
      decoded = null;
    }

    return decoded;
  }
}

export default JWT;
