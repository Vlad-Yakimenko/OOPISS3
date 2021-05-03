import { Connector, TableName } from "@app/db";
import { Tariff } from "@app/entity";
import { AbstractRepository } from "./repository.abstract";

export class TariffRepository extends AbstractRepository<Tariff> {
  protected readonly connector: Connector;

  constructor(
    connector: Connector = new Connector()
  ) {
    super(connector);
  }

  public async count(): Promise<number> {
    const query = `SELECT COUNT(*) as tariffCounter FROM ${TableName.Tariff}; `;
    return this.connector
      .query(query)
      .then(rows => rows[0].tariffCounter);
  }

  public async findById(id: number): Promise<Tariff | null> {
    const query = `SELECT * FROM ${TableName.Tariff} WHERE id = ?; `;
    const values = [id];
    return this.connector
      .query(query, values)
      .then(rows => rows[0] || null);
  }

  public async create(tariff: Tariff): Promise<void> {
    const query = `INSERT INTO ${TableName.Tariff} (naming, discount, country, cost)
      VALUES (?, ?, ?, ?); `;
    const values = [tariff.naming, tariff.discount, tariff.country, tariff.cost];
    await this.connector.query(query, values);
  }

  public async findByNaming(naming: string): Promise<Tariff | null> {
    const query = `SELECT * FROM ${TableName.Tariff} WHERE naming = ?; `;
    const values = [naming];
    return this.connector
      .query(query, values)
      .then(rows => rows[0] || null);
  }

  public async findAllTariffs(): Promise<Tariff[]> {
    const query = `SELECT * FROM ${TableName.Tariff}; `;
    return this.connector.query(query);
  }

  public async findTariffsByUserId(userId: number): Promise<Tariff[]> {
    const query = `SELECT * FROM ${TableName.Tariff} WHERE id IN (
      SELECT tariffId FROM ${TableName.User_Tariff} WHERE userId = ?
    ); `;
    const values = [userId];
    return this.connector.query(query, values);
  }
}
