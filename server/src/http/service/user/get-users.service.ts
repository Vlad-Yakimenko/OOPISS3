import { User } from "@app/entity";
import { UserRepository } from "@app/repository";

export class GetUsersService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  public async getAbonents(): Promise<{ abonents: User[] }> {
    const abonents: User[] = await this.userRepository.findAllAbonents();
    return { abonents };
  }

  public async getUserById(userId: number): Promise<{ user: User }> {
    const user = await this.userRepository.findById(userId);
    return { user };
  }
};
