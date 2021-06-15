import { AddCallingsDto } from '@app/shared/dto/calling';
import { HttpMessageResponse } from '@app/shared/enum';
import {
  BadRequestException, ForbiddenException,
  NotFoundException
} from '@app/shared/error';
import {
  CallingRepository, TariffRepository, UserRepository
} from '@app/db/repository';
import { Injectable } from '@nestjs/common';
import { Calling, Tariff } from '@app/shared/interface';

@Injectable()
export class AddCallingsService {
  constructor(
    private readonly callingRepository: CallingRepository,
    private readonly userRepository: UserRepository,
    private readonly tariffRepository: TariffRepository,
  ) { }

  public async addCallings(addCallingsDto: AddCallingsDto): Promise<{ status: string }> {
    const { userId, callings } = addCallingsDto;

    for (const calling of callings) {
      if (calling.senderId != userId) {
        throw new BadRequestException('User does not provided as sender in calling');
      }

      const expectedCallingCost: number = await this.calculateCallingCost(calling);
      if (expectedCallingCost != calling.cost) {
        throw new BadRequestException('Provided incorrect cost for the calling');
      }
    }

    const newBalance: number = await this.calculateNewBalance(userId, callings);
    if (newBalance < 0) {
      throw new ForbiddenException('User does not have enough money');
    }

    const addCallingOperations = callings.map(calling => this.callingRepository.createAndSave(calling));
    await Promise.all([...addCallingOperations, this.userRepository.changeBalance(userId, newBalance)]);
    return { status: HttpMessageResponse.OK };
  }

  private async calculateCallingCost(calling: Calling): Promise<number> {
    const { senderId, receiverId } = calling;
    const receiver = await this.userRepository.findById(receiverId);

    const actualSenderTariffs: Tariff[] = await this.tariffRepository
      .findTariffsByUserId(senderId)
      .then(tariffs => tariffs.filter(tariff => tariff.country === receiver.country));

    const discountInPercentages: number = actualSenderTariffs
      .reduce((acc, tariff) => acc + Number(tariff.discount), 0);
    return ((100 - discountInPercentages) / 100) * calling.duration; // 1 sec - 1 monetary unit
  }

  private async calculateNewBalance(userId: number, callings: Calling[]): Promise<number> {
    const priceToPay: number = callings
      .map(calling => calling.cost)
      .reduce((acc, curr) => acc + curr, 0);

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user.bill.balance - priceToPay;
  }
}
