import { EntityRepository, Repository } from "typeorm";

import { Bill } from "@app/shared/interface";
import { BillEntity } from "../entity";

@EntityRepository(BillEntity)
export class BillRepository extends Repository<BillEntity> {
  constructor() {
    super();
  }

  public async findById(id: number): Promise<BillEntity | null> {
    return this.findOne(id);
  }

  public async createAndSave(bill: Bill): Promise<void> {
    await this.save(this.create(bill));
  }
}
