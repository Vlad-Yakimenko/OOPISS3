import { Connector, TableName } from "@app/db";
import { User } from "@app/entity";
import { AbstractRepository } from "./repository.abstract";

export class UserRepository extends AbstractRepository<User> {
  protected readonly connector: Connector;

  constructor(
    connector: Connector = new Connector()
  ) {
    super(connector);
  }

  public async count(): Promise<number> {
    const query = `SELECT COUNT(*) as userCounter FROM ${TableName.User}; `;
    return this.connector.query(query).then(rows => rows[0].userCounter);
  }

  public async findById(id: number): Promise<User | null> {
    const query = `SELECT * FROM ${TableName.User} WHERE id = ?; `;
    const values = [id];
    return this.connector.query(query, values).then(rows => rows[0] || null);
  }

  public async findByUsername(username: string): Promise<User | null> {
    const query = `SELECT * FROM ${TableName.User} WHERE username = ?; `;
    const values = [username];
    return this.connector.query(query, values).then(rows => rows[0] || null);
  }

  public async create(user: User): Promise<void> {
    let query: string;
    let values: any[];

    query = `INSERT INTO ${TableName.User} (username, password, isConnected, country, role)
      VALUES (?, ?, ?, ?, ?); `;
    values = [user.username, user.password, user.isConnected, user.country, user.role];

    await this.connector.query(query, values);

    query = `INSERT INTO ${TableName.Bill} (userId, balance, currency)
      VALUES ((SELECT id FROM ${TableName.User} ORDER BY id DESC LIMIT 1), ?, ?);
      UPDATE ${TableName.User} SET billId = (SELECT id FROM ${TableName.Bill} ORDER BY id DESC LIMIT 1); `;
    values = [user.bill.balance, user.bill.currency];

    await this.connector.query(query, values);
  }
}
