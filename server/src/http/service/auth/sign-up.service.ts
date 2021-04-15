import { HttpMessageResponse } from './../../enum/http-message-response.enum';
import { SignUpDto } from "@app/dto/auth";
import { User } from "@app/entity";
import { ConflictException } from "@app/http/error";
import { UserRepository } from "@app/repository";
import { CryptoHelperService } from '@app/helper';
import { Role } from "@app/entity/enum";

export class SignUpService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
    private readonly cryptoHelperService: CryptoHelperService = new CryptoHelperService(),
  ) { }

  public async signUp(signUpDto: SignUpDto): Promise<{ status: string }> {
    const existingUser = await this.userRepository.findByUsername(signUpDto.username);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword: string = await this.cryptoHelperService.hash(signUpDto.password);

    const newUser: User = {
      username: signUpDto.username,
      password: hashedPassword,
      isConnected: false,
      country: signUpDto.country,
      role: Role.Abonent,
      bill: {
        balance: 0,
        currency: signUpDto.currency,
      }
    };

    await this.userRepository.create(newUser);

    return { status: HttpMessageResponse.OK };
  }
}
