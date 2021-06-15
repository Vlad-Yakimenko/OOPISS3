import { Injectable } from '@nestjs/common';

import { ChangeUserBalanceDto } from '@app/shared/dto/user';
import { HttpMessageResponse } from "@app/shared/enum";
import { UserRepository } from "@app/db/repository";

@Injectable()
export class ChangeUserBalanceService {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  public async changeUserBalance(changeUserBalanceDto: ChangeUserBalanceDto): Promise<{ status: string }> {
    const { userId, newBalance } = changeUserBalanceDto;
    await this.userRepository.changeBalance(userId, newBalance);
    return { status: HttpMessageResponse.OK };
  }
};