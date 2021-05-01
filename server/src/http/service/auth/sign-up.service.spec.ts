import { SignUpDto } from '@app/dto/auth';
import { User } from '@app/entity';
import { Country, Currency, Role } from '@app/entity/enum';
import { HttpMessageResponse } from '@app/http/enum';
import { ConflictException } from "@app/http/error";
import { genRandomInt, genRandomString } from "@test/random";
import { SignUpService } from "./sign-up.service";

describe('`SignUpService`', () => {
  let signUpService: SignUpService;
  const mockUserRepository = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };
  const mockCryptoHelperService = {
    hash: jest.fn(),
  };

  beforeEach(() => {
    signUpService = new SignUpService(
      mockUserRepository as any,
      mockCryptoHelperService as any,
    );
  });

  it('should be instance of `SignUpService`', () => {
    expect(signUpService).toBeInstanceOf(SignUpService);
    expect(new SignUpService()).toBeInstanceOf(SignUpService);
  });

  describe('`signUp`', () => {
    it('should throw `ConflictException` if user already exists', async () => {
      const userId = genRandomInt();
      const username = genRandomString();
      const user = {
        id: userId,
        username
      };
      const signUpDto: SignUpDto = {
        username,
        password: 'password',
        country: Country.Ukraine,
        currency: Currency.UAH,
      };

      mockUserRepository.findByUsername.mockResolvedValue(user);
      await expect(signUpService.signUp(signUpDto))
        .rejects
        .toThrowError(ConflictException);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(signUpDto.username);
    });

    it('should create user if not exists', async () => {
      const signUpDto: SignUpDto = {
        username: genRandomString(),
        password: genRandomString(),
        country: Country.Ukraine,
        currency: Currency.UAH,
      };
      const hashedPassword: string = 'hashedPassword';
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

      mockCryptoHelperService.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.findByUsername.mockResolvedValue(null);

      await expect(signUpService.signUp(signUpDto))
        .resolves
        .toEqual({ status: HttpMessageResponse.OK });
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(signUpDto.username);
      expect(mockCryptoHelperService.hash).toHaveBeenCalledWith(signUpDto.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith(newUser);
    });
  });
});
