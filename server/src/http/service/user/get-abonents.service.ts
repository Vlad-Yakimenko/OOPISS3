import { User } from "@app/entity";
import { UserRepository } from "@app/repository";

export class GetAbonentsService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  public async getAbonents(): Promise<{ abonents: User[] }> {
    const abonents: User[] = await this.userRepository.findAllAbonents();
    return { abonents };
  }
};