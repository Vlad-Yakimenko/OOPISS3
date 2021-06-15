import { EntityRepository, Repository } from "typeorm";

import { User } from "@app/shared/interface";
import { UserEntity } from "../entity";
import { Role } from "../entity/enum";
import { TableName } from "../table-name.enum";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  constructor() {
    super();
  }

  public async findById(id: number): Promise<UserEntity | null> {
    return this.findOne(id);
  }

  public async findByPhone(phone: string): Promise<UserEntity | null> {
    return this.findOne({ phone });
  }

  public async createAndSave(user: User): Promise<void> {
    await this.save(this.create(user));
  }

  public async changeStatus(id: number): Promise<void> {
    const query = `UPDATE ${TableName.User} SET isConnected = !isConnected WHERE id = ?; `;
    const values = [id];
    await this.query(query, values);
  }

  public async changeBalance(id: number, newBalance: number): Promise<void> {
    const query = `UPDATE ${TableName.Bill} SET balance = ? WHERE id IN
      (SELECT billId FROM ${TableName.User} WHERE id = ?); `;
    const values = [newBalance, id];
    await this.query(query, values);
  }

  public async addTariff(userId: number, tariffId: number): Promise<void> {
    const query = `INSERT INTO ${TableName.User_Tariff} (userId, tariffId)
      VALUES (?, ?); `;
    const values = [userId, tariffId];
    await this.query(query, values);
  }

  public async findAllAbonents(): Promise<UserEntity[]> {
    return this.find({ where: { role: Role.Abonent }, relations: ['tariffs', 'bill'] });
  }
}
