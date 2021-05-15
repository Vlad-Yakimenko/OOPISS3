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
    findByPhone: jest.fn(),
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
      const phone = genRandomString();
      const user = {
        id: userId,
        phone,
      };
      const signUpDto: SignUpDto = {
        phone,
        password: 'password',
        country: Country.Ukraine,
        currency: Currency.UAH,
      };

      mockUserRepository.findByPhone.mockResolvedValue(user);
      await expect(signUpService.signUp(signUpDto))
        .rejects
        .toThrowError(ConflictException);
      expect(mockUserRepository.findByPhone).toHaveBeenCalledWith(signUpDto.phone);
    });

    it('should create user if not exists', async () => {
      const signUpDto: SignUpDto = {
        phone: genRandomString(),
        password: genRandomString(),
        country: Country.Ukraine,
        currency: Currency.UAH,
      };
      const hashedPassword: string = 'hashedPassword';
      const newUser: User = {
        phone: signUpDto.phone,
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
      mockUserRepository.findByPhone.mockResolvedValue(null);

      await expect(signUpService.signUp(signUpDto))
        .resolves
        .toEqual({ status: HttpMessageResponse.OK });
      expect(mockUserRepository.findByPhone).toHaveBeenCalledWith(signUpDto.phone);
      expect(mockCryptoHelperService.hash).toHaveBeenCalledWith(signUpDto.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith(newUser);
    });
  });
});
