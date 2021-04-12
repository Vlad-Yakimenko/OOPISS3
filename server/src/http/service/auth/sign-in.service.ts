import { SignInDto } from "@app/dto/auth";
import {
  NotFoundException, UnauthorizedException
} from "@app/http/error";
import { UserRepository } from "@app/repository";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { TokenService } from "./token.service";

export class SignInService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
    private readonly tokenService: TokenService = new TokenService(),
  ) { }

  public async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    const user = await this.userRepository.findByUsername(signInDto.username);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isPasswordCorrect: boolean = await bcrypt.compare(signInDto.password, user.password); //TODO: move this stuff to CryptoHelperService

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect credentials');
    }

    const token = this.tokenService.sign({ 
      userId: user.id, 
      role: user.role,
    });

    return { token };
  }
}
