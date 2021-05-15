import { SignInDto } from '@app/dto/auth';
import { Role } from '@app/entity/enum';
import { ForbiddenException, NotFoundException } from '@app/http/error';
import { genRandomInt, genRandomString } from '@test/random';
import { SignInService } from "./sign-in.service";

describe('`SignInService`', () => {
  let signInService: SignInService;
  const mockUserRepository = {
    findByPhone: jest.fn(),
  };
  const mockTokenService = {
    sign: jest.fn(),
  };
  const mockCryptoHelperService = {
    compare: jest.fn(),
  };

  beforeEach(() => {
    signInService = new SignInService(
      mockUserRepository as any,
      mockTokenService as any,
      mockCryptoHelperService as any
    );
  });

  it('should be instance of `SignInService`', () => {
    expect(signInService).toBeInstanceOf(SignInService);
    expect(new SignInService()).toBeInstanceOf(SignInService);
  });

  describe('`signIn`', () => {
    it('should throw `NotFoundException` if user does not exist', async () => {
      const signInDto: SignInDto = {
        phone: genRandomString(),
        password: genRandomString(),
      };
      mockUserRepository.findByPhone.mockResolvedValue(null);

      await expect(signInService.signIn(signInDto))
        .rejects
        .toThrowError(NotFoundException);
      expect(mockUserRepository.findByPhone).toHaveBeenCalledWith(signInDto.phone);
    });

    it('should throw `ForbiddenException` if password not correct', async () => {
      const signInDto: SignInDto = {
        phone: genRandomString(),
        password: genRandomString(),
      };
      const user = {
        id: genRandomInt(),
        phone: signInDto.phone,
        password: 'hashedPassword',
        role: Role.Abonent,
      };

      mockCryptoHelperService.compare.mockResolvedValue(false);
      mockUserRepository.findByPhone.mockResolvedValue(user);

      await expect(signInService.signIn(signInDto))
        .rejects
        .toThrowError(ForbiddenException);
      expect(mockUserRepository.findByPhone).toHaveBeenCalledWith(signInDto.phone);
      expect(mockCryptoHelperService.compare).toHaveBeenCalledWith(signInDto.password, user.password);
    });

    it('should sign token and return it if provided correct credentials', async () => {
      const signInDto: SignInDto = {
        phone: genRandomString(),
        password: genRandomString(),
      };
      const user = {
        id: genRandomInt(),
        phone: signInDto.phone,
        password: 'hashedPassword',
        role: Role.Abonent,
      };
      const signedToken: string = 'signedToken';

      mockCryptoHelperService.compare.mockResolvedValue(true);
      mockUserRepository.findByPhone.mockResolvedValue(user);
      mockTokenService.sign.mockReturnValue(signedToken);

      await expect(signInService.signIn(signInDto))
        .resolves
        .toEqual({ token: signedToken });
      expect(mockUserRepository.findByPhone).toHaveBeenCalledWith(signInDto.phone);
      expect(mockCryptoHelperService.compare).toHaveBeenCalledWith(signInDto.password, user.password);
      expect(mockTokenService.sign).toHaveBeenCalledWith({ userId: user.id, role: user.role });
    });
  });
});
