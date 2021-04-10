import { SignUpDto } from "@app/dto/auth";
import { User } from "@app/entity";
import { Currency, Role } from "@app/entity/enum";
import { BadRequestException } from "@app/http/error";
import { ILogger, Logger } from "@app/log";
import {
  UserRepository
} from "@app/repository";
import * as bcrypt from 'bcryptjs';

export class SignUpService {
  constructor(
    private readonly logger: ILogger = new Logger(),
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  public async signUp(user: SignUpDto): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(user.username);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(user.password, salt);

    const newUser: User = {
      username: user.username,
      password: hashedPassword,
      isConnected: false,
      country: user.country,
      role: Role.Abonent,
      bill: {
        balance: 0,
        currency: Currency.UAH,
      }
    };

    await this.userRepository.create(newUser);

    return newUser;
  }
}
