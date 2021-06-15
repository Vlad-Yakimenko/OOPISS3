import { Calling } from "@app/shared/interface";
import { EntityRepository, Repository } from "typeorm";
import { CallingEntity } from "../entity";
import { TableName } from "../table-name.enum";

@EntityRepository(CallingEntity)
export class CallingRepository extends Repository<CallingEntity> {
  constructor() {
    super();
  }

  public async findById(id: number): Promise<CallingEntity | null> {
    return this.findOne(id);
  }

  public async createAndSave(calling: Calling): Promise<void> {
    const query = `INSERT INTO ${TableName.Calling} (receiverId, senderId, cost, duration)
      VALUES (?, ?, ?, ?); `;
    const values = [calling.receiverId, calling.senderId, calling.cost, calling.duration];

    await this.query(query, values);
  }

  public async findCallingsByUserId(userId: number): Promise<CallingEntity[]> {
    const query = `SELECT * FROM ${TableName.Calling} WHERE receiverId = ? OR senderId = ?; `;
    const values = [userId, userId];
    return this.query(query, values);
  }
}
