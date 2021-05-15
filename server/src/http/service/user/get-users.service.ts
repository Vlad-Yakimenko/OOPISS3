import { User } from "@app/entity";
import { NotFoundException } from "@app/http/error";
import { UserRepository } from "@app/repository";

export class GetUsersService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) { }

  public async getAbonents(): Promise<{ abonents: User[] }> {
    const abonents: User[] = await this.userRepository.findAllAbonents();
    return { abonents };
  }

  public async getUserById(userId: number): Promise<{ user: User }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return { user };
  }

  public async getUserByPhone(phone: string): Promise<{ user: User }> {
    const user = await this.userRepository.findByPhone(phone);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return { user };
  }
};
