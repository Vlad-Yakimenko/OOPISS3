import { Connector, TableName } from "@app/db";
import {
  Bill, Tariff, User
} from "@app/entity";
import { Role } from "@app/entity/enum";
import { UnionType } from "typescript";
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
    const query = `SELECT ${TableName.User}.id, ${TableName.User}.username, ${TableName.User}.isConnected,
      ${TableName.User}.country, ${TableName.User}.role, ${TableName.User}.billId, ${TableName.User}.password,
      ${TableName.Bill}.userId, ${TableName.Bill}.balance, ${TableName.Bill}.currency FROM 
      ${TableName.User} LEFT JOIN ${TableName.Bill} ON
      ${TableName.User}.billId = ${TableName.Bill}.id WHERE ${TableName.User}.id = ?; `;
    const values = [id];
    return this.connector.query(query, values).then(rows => rows[0] ? this.extractBill(rows[0]) : null);
  }

  public async findByUsername(username: string): Promise<User | null> {
    const query = `SELECT ${TableName.User}.id, ${TableName.User}.username, ${TableName.User}.isConnected,
      ${TableName.User}.country, ${TableName.User}.role, ${TableName.User}.billId, ${TableName.User}.password,
      ${TableName.Bill}.userId, ${TableName.Bill}.balance, ${TableName.Bill}.currency FROM 
      ${TableName.User} LEFT JOIN ${TableName.Bill} ON
      ${TableName.User}.billId = ${TableName.Bill}.id WHERE ${TableName.User}.username = ?; `;
    const values = [username];
    return this.connector.query(query, values).then(rows => rows[0] ? this.extractBill(rows[0]) : null);
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
      UPDATE ${TableName.User} SET billId = (SELECT id FROM ${TableName.Bill}
      ORDER BY id DESC LIMIT 1) WHERE ${TableName.User}.username = ?; `;
    values = [user.bill.balance, user.bill.currency, user.username];

    await this.connector.query(query, values);
  }

  public async changeStatus(id: number): Promise<void> {
    const query = `UPDATE ${TableName.User} SET isConnected = !isConnected WHERE id = ?; `;
    const values = [id];
    return this.connector.query(query, values);
  }

  public async changeBalance(id: number, newBalance: number): Promise<void> {
    const query = `UPDATE ${TableName.Bill} SET balance = ? WHERE id IN
      (SELECT billId FROM ${TableName.User} WHERE id = ?); `;
    const values = [newBalance, id];
    return this.connector.query(query, values);
  }

  public async findAllAbonents(): Promise<User[]> {
    let query: string;
    let values: any[];

    query = `SELECT ${TableName.User}.id, ${TableName.User}.username, ${TableName.User}.isConnected,
      ${TableName.User}.country, ${TableName.User}.role, ${TableName.User}.billId, 
      ${TableName.Bill}.userId, ${TableName.Bill}.balance, ${TableName.Bill}.currency FROM 
      ${TableName.User} LEFT JOIN ${TableName.Bill} ON
      ${TableName.User}.billId = ${TableName.Bill}.id WHERE ${TableName.User}.role = ?; `;
    values = [Role.Abonent];
    const abonents: User[] = await this.connector
      .query(query, values)
      .then(abonents => abonents.map((abonent: User) => {
        abonent.isConnected = abonent.isConnected == 1 ? true : false;
        return abonent;
      }));

    query = `SELECT ${TableName.Tariff}.*, ${TableName.User_Tariff}.userId FROM
      ${TableName.Tariff} LEFT JOIN ${TableName.User_Tariff} ON
      ${TableName.Tariff}.id = ${TableName.User_Tariff}.tariffId
      WHERE ${TableName.User_Tariff}.userId IN (?);`;
    values = [...abonents.map(abonent => abonent.id)];

    const tariffs: Array<Tariff & { userId: number }> = await this.connector.query(query, values);

    return abonents.map(abonent => this.extractTariffs(this.extractBill(abonent), tariffs));
  }

  public async addTariff(userId: number, tariffId: number): Promise<void> {
    const query = `INSERT INTO ${TableName.User_Tariff} (userId, tariffId)
      VALUES (?, ?); `;
    const values = [userId, tariffId];
    await this.connector.query(query, values);
  }

  private extractBill(user: User): User {
    const fieldsToDelete = ['billId', 'userId', 'balance', 'currency'];
    user.bill = {} as Bill;
    for (const [key, value] of Object.entries(user)) {
      if (fieldsToDelete.includes(key)) {
        user.bill[key == 'billId' ? 'id' : key] = value;
        delete user[key];
      }
    }
    return user;
  }

  private extractTariffs(user: User, tariffs: Array<Tariff & { userId: number }>): User {
    const fieldsToDelete = ['userId'];
    const userTariffs: Array<Tariff & { userId: number }> = tariffs
      .filter(tariff => tariff.userId === user.id)
      .map(tariff => {
        for (const [key, value] of Object.entries(tariff)) {
          if (fieldsToDelete.includes(key)) {
            delete tariff[key];
          }
        }
        return tariff;
      });
    user.tariffs = userTariffs;
    return user;
  }
}
