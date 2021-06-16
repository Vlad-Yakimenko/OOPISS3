import { Injectable } from "@nestjs/common";

import { AddUserTariffsDto } from "@app/shared/dto/user";
import { Tariff } from "@app/shared/interface";
import { HttpMessageResponse } from "@app/shared/enum";
import { ForbiddenException, NotFoundException } from "@app/shared/error";
import { UserRepository } from "@app/db/repository";

@Injectable()
export class AddUserTariffsService {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  public async addTariffs(addUserTariffsDto: AddUserTariffsDto): Promise<{ status: string }> {
    const { userId, tariffs } = addUserTariffsDto;
    const newBalance: number = await this.calculateNewBalance(userId, tariffs);

    if (newBalance < 0) {
      throw new ForbiddenException('User does not have enough money');
    }

    const addTariffOperations = tariffs.map(tariff => this.userRepository.addTariff(userId, tariff.id));

    await Promise.all([...addTariffOperations, this.userRepository.changeBalance(userId, newBalance)]);
    return { status: HttpMessageResponse.OK };
  }

  private async calculateNewBalance(userId: number, tariffs: Tariff[]): Promise<number> {
    const priceToPay: number = tariffs
      .map(tariff => tariff.cost)
      .reduce((acc, curr) => acc + curr, 0);

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user.bill.balance - priceToPay;
  }
}