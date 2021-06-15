import { Injectable } from '@nestjs/common';

import { HttpMessageResponse } from '@app/shared/enum';
import { SignUpDto } from "@app/shared/dto/auth";
import { UserEntity } from "@app/db/entity";
import { ConflictException } from "@app/shared/error";
import { UserRepository } from "@app/db/repository";
import { CryptoHelperService } from '@app/shared/helper';
import { Role } from "@app/db/entity/enum";

@Injectable()
export class SignUpService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoHelperService: CryptoHelperService,
  ) { }

  public async signUp(signUpDto: SignUpDto): Promise<{ status: string }> {
    const existingUser = await this.userRepository.findByPhone(signUpDto.phone);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword: string = await this.cryptoHelperService.hash(signUpDto.password);

    const newUser = {
      phone: signUpDto.phone,
      password: hashedPassword,
      isConnected: false,
      country: signUpDto.country,
      role: Role.Abonent,
      bill: {
        balance: 0,
        currency: signUpDto.currency,
      },
    } as UserEntity;

    await this.userRepository.createAndSave(newUser);

    return { status: HttpMessageResponse.OK };
  }
}
