import { ChangeUserBalanceDto } from '@app/dto/user';
import { HttpMessageResponse } from "@app/http/enum";
import { UserRepository } from "@app/repository";

export class ChangeUserBalanceService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) { }

  public async changeUserBalance(changeUserBalanceDto: ChangeUserBalanceDto): Promise<{ status: string }> {
    const { userId, newBalance } = changeUserBalanceDto;
    await this.userRepository.changeBalance(userId, newBalance);
    return { status: HttpMessageResponse.OK };
  }
};