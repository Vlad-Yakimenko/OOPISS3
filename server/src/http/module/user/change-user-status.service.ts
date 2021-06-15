import { Injectable } from '@nestjs/common';

import { ChangeUserStatusDto } from '@app/shared/dto/user';
import { HttpMessageResponse } from "@app/shared/enum";
import { UserRepository } from "@app/db/repository";

@Injectable()
export class ChangeUserStatusService {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  public async changeUserStatus(changeUserStatusDto: ChangeUserStatusDto): Promise<{ status: string }> {
    await this.userRepository.changeStatus(changeUserStatusDto.userId);
    return { status: HttpMessageResponse.OK };
  }
};