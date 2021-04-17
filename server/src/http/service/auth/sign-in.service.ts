import { SignInDto } from "@app/dto/auth";
import {
  NotFoundException, UnauthorizedException
} from "@app/http/error";
import { UserRepository } from "@app/repository";
import { TokenService } from "./token.service";
import { CryptoHelperService } from "@app/helper";

export class SignInService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
    private readonly tokenService: TokenService = new TokenService(),
    private readonly cryptoHelperService: CryptoHelperService = new CryptoHelperService(),
  ) { }

  public async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    const user = await this.userRepository.findByUsername(signInDto.username);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isPasswordCorrect: boolean = await this.cryptoHelperService.compare(signInDto.password, user.password);

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
