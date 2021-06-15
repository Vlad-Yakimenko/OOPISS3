import { EntityRepository, Repository } from "typeorm";

import { Tariff } from "@app/shared/interface";
import { TariffEntity } from "../entity";
import { TableName } from "../table-name.enum";

@EntityRepository(TariffEntity)
export class TariffRepository extends Repository<TariffEntity> {
  constructor() {
    super();
  }

  public async findById(id: number): Promise<TariffEntity | null> { 
    return this.findOne(id);
  }

  public async createAndSave(tariff: Tariff): Promise<void> { 
    await this.save(this.create(tariff));
  }

  public async findByNaming(naming: string): Promise<TariffEntity | null> { 
    return this.findOne({ naming });
  }

  public async findAllTariffs(): Promise<TariffEntity[]> { 
    const query = `SELECT * FROM ${TableName.Tariff}; `;
    return this.query(query);
  }

  public async findTariffsByUserId(userId: number): Promise<TariffEntity[]> { 
    const query = `SELECT * FROM ${TableName.Tariff} WHERE id IN (
      SELECT tariffId FROM ${TableName.User_Tariff} WHERE userId = ?
    ); `;
    const values = [userId];
    return this.query(query, values);
  }
}
