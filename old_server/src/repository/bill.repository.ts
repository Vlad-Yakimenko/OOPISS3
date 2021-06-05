import { Connector, TableName } from "@app/db";
import { Bill } from "@app/entity";
import { AbstractRepository } from "./repository.abstract";

export class BillRepository extends AbstractRepository<Bill> {
  protected readonly connector: Connector;

  constructor(
    connector: Connector = new Connector()
  ) {
    super(connector);
  }

  public async count(): Promise<number> {
    const query = `SELECT COUNT(*) as billCounter FROM ${TableName.Bill}; `;
    return this.connector.query(query).then(rows => rows[0].billCounter);
  }

  public async findById(id: number): Promise<Bill | null> {
    const query = `SELECT * FROM ${TableName.Bill} WHERE id = ?; `;
    const values = [id];
    return this.connector.query(query, values).then(rows => rows[0] || null);
  }

  public async create(bill: Bill): Promise<void> {
    let query: string;
    let values: any[];

    query = `INSERT INTO ${TableName.Bill} (userId, balance, currency)
      VALUES (?, ?, ?); `;
    values = [bill.user, bill.balance, bill.currency];

    await this.connector.query(query, values);
  }
}
