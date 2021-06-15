import { Injectable } from "@nestjs/common";

import { SignInDto } from "@app/shared/dto/auth";
import {
  ForbiddenException, NotFoundException,
} from "@app/shared/error";
import { UserRepository } from "@app/db/repository";
import { TokenService } from "./token.service";
import { CryptoHelperService } from "@app/shared/helper";

@Injectable()
export class SignInService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly cryptoHelperService: CryptoHelperService,
  ) { }

  public async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    const user = await this.userRepository.findByPhone(signInDto.phone);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isPasswordCorrect: boolean = await this.cryptoHelperService.compare(
      signInDto.password, user.password
    );

    if (!isPasswordCorrect) {
      throw new ForbiddenException('Incorrect credentials');
    }

    const token = this.tokenService.sign({
      userId: user.id,
      role: user.role,
    });

    return { token };
  }
}
