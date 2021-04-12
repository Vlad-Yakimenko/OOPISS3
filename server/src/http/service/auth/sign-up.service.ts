import { SignUpDto } from "@app/dto/auth";
import { User } from "@app/entity";
import { Currency } from "@app/entity/enum";
import { ConflictException } from "@app/http/error";
import { UserRepository } from "@app/repository";
import { CryptoHelperService } from '@app/helper';

export class SignUpService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
    private readonly cryptoHelperService: CryptoHelperService = new CryptoHelperService(),
  ) { }

  public async signUp(signUpDto: SignUpDto): Promise<User> {
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
      role: signUpDto.role,
      bill: {
        balance: 0,
        currency: Currency.UAH,
      }
    };

    await this.userRepository.create(newUser);

    return newUser;
  }
}
