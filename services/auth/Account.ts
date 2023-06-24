class Account {
  private id: string;
  private name: string;
  private email: string;
  private password: string;
  private created_at: string;
  private phone: string;

  constructor(id: string, name: string, email: string, phone: string, password: string, created_at: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.created_at = created_at;
  }
}

export default Account;
