import { SignUpDto } from "@app/dto/auth";
import { User } from "@app/entity";
import { Currency, Role } from "@app/entity/enum";
import { ConflictException } from "@app/http/error";
import {
  UserRepository
} from "@app/repository";
import * as bcrypt from 'bcryptjs';

export class SignUpService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
  ) { }

  public async signUp(signUpDto: SignUpDto): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(signUpDto.username);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcrypt.genSalt(10); //TODO: move this stuff to CryptoHelperService
    const hashedPassword: string = await bcrypt.hash(signUpDto.password, salt);

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
