import { Injectable } from "@nestjs/common";

import { User } from "@app/shared/interface";
import { NotFoundException } from "@app/shared/error";
import { UserRepository } from "@app/db/repository";

@Injectable()
export class GetUsersService {
  constructor(
    private readonly userRepository: UserRepository,
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
