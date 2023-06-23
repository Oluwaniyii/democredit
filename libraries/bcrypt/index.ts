import bcrypt from "bcryptjs";

class Bcrypt {
  public static async compare(password1: string, password2: string): Promise<boolean> {
    return bcrypt.compare(password1, password2);
  }

  public static async hash(password: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }
}

export default Bcrypt;
