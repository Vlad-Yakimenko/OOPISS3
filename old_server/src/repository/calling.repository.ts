import { Connector, TableName } from "@app/db";
import { Calling } from "@app/entity";
import { AbstractRepository } from "./repository.abstract";

export class CallingRepository extends AbstractRepository<Calling> {
  protected readonly connector: Connector;

  constructor(
    connector: Connector = new Connector()
  ) {
    super(connector);
  }

  public async count(): Promise<number> {
    const query = `SELECT COUNT(*) as callingCounter FROM ${TableName.Calling}; `;
    return this.connector.query(query).then(rows => rows[0].callingCounter);
  }

  public async findById(id: number): Promise<Calling | null> {
    const query = `SELECT * FROM ${TableName.Calling} WHERE id = ?; `;
    const values = [id];
    return this.connector.query(query, values).then(rows => rows[0] || null);
  }

  public async create(calling: Calling): Promise<void> {
    let query: string;
    let values: any[];

    query = `INSERT INTO ${TableName.Calling} (receiverId, senderId, cost, duration)
      VALUES (?, ?, ?, ?); `;
    values = [calling.receiverId, calling.senderId, calling.cost, calling.duration];

    await this.connector.query(query, values);
  }

  public async findCallingsByUserId(userId: number): Promise<Calling[]> {
    const query = `SELECT * FROM ${TableName.Calling} WHERE receiverId = ? OR senderId = ?; `;
    const values = [userId, userId];
    return this.connector.query(query, values);
  }
}