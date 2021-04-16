import { ChangeUserStatusDto } from '@app/dto/user';
import { HttpMessageResponse } from "@app/http/enum";
import { UserRepository } from "@app/repository";

export class ChangeUserStatusService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) { }

  public async changeUserStatus(changeUserStatusDto: ChangeUserStatusDto): Promise<{ status: string }> {
    await this.userRepository.changeStatus(changeUserStatusDto.userId);
    return { status: HttpMessageResponse.OK };
  }
};