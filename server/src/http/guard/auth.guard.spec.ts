import { Role } from '@app/entity/enum';
import { genRandomInt, genRandomString } from '@test/random';
import { UnauthorizedException } from '../error';
import { AuthGuard } from './auth.guard';

describe('`AuthGuard`', () => {
  let authGuard: AuthGuard;
  const mockTokenService = {
    extractToken: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };
  const mockUserRepository = {
    findByUsername: jest.fn(),
  };

  beforeEach(() => {
    authGuard = new AuthGuard(
      mockTokenService as any,
      mockUserRepository as any,
    );
  });

  it('should be instance of `AuthGuard`', () => {
    expect(authGuard).toBeInstanceOf(AuthGuard);
    expect(new AuthGuard()).toBeInstanceOf(AuthGuard);
  });

  describe('`canActivate`', () => {
    it('should throw `UnauthorizedException` if token is not valid', async () => {
      const mockRequest: any = {};
      const token = 'token';

      mockTokenService.extractToken.mockReturnValue(token);
      mockTokenService.verify.mockReturnValue(false);

      await expect(authGuard.canActivate(mockRequest))
        .rejects
        .toThrowError(UnauthorizedException);
      expect(mockTokenService.extractToken).toHaveBeenCalledWith(mockRequest);
      expect(mockTokenService.verify).toHaveBeenCalledWith(token);
    });

    it('should return false if user is not admin and userId-s are different', async () => {
      const mockRequest: any = {};
      const token = 'token';
      const userId = genRandomInt();

      mockTokenService.extractToken.mockReturnValue(token);
      mockTokenService.verify.mockReturnValue(true);
      mockTokenService.decode.mockReturnValue({ userId: 'some_other_userId' });

      await expect(authGuard.canActivate(mockRequest, userId))
        .resolves
        .toEqual(false);
      expect(mockTokenService.extractToken).toHaveBeenCalledWith(mockRequest);
      expect(mockTokenService.verify).toHaveBeenCalledWith(token);
      expect(mockTokenService.decode).toHaveBeenCalledWith(token);
    });

    it('should return false if user is not admin and usernames are different', async () => {
      const mockRequest: any = {};
      const token = 'token';
      const userId = genRandomInt();
      const username = genRandomString(10);

      mockTokenService.extractToken.mockReturnValue(token);
      mockTokenService.verify.mockReturnValue(true);
      mockTokenService.decode.mockReturnValue({ userId: 'some_other_userId' });
      mockUserRepository.findByUsername.mockResolvedValue({ id: userId });

      await expect(authGuard.canActivate(mockRequest, undefined, username))
        .resolves
        .toEqual(false);
      expect(mockTokenService.extractToken).toHaveBeenCalledWith(mockRequest);
      expect(mockTokenService.verify).toHaveBeenCalledWith(token);
      expect(mockTokenService.decode).toHaveBeenCalledWith(token);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(username);
    });

    it('should return false if user with provided username does not exist', async () => {
      const mockRequest: any = {};
      const token = 'token';
      const username = genRandomString(10);

      mockTokenService.extractToken.mockReturnValue(token);
      mockTokenService.verify.mockReturnValue(true);
      mockTokenService.decode.mockReturnValue({ userId: 'some_other_userId' });
      mockUserRepository.findByUsername.mockResolvedValue(null); // nothing found

      await expect(authGuard.canActivate(mockRequest, undefined, username))
        .resolves
        .toEqual(false);
      expect(mockTokenService.extractToken).toHaveBeenCalledWith(mockRequest);
      expect(mockTokenService.verify).toHaveBeenCalledWith(token);
      expect(mockTokenService.decode).toHaveBeenCalledWith(token);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(username);
    });

    it('should return true if user is admin or userId-s/usernames are the same', async () => {
      const mockRequest: any = {};
      const token = 'token';
      const userId = genRandomInt();

      mockTokenService.extractToken.mockReturnValue(token);
      mockTokenService.verify.mockReturnValue(true);
      mockTokenService.decode.mockReturnValue({ userId, role: Role.Admin });

      await expect(authGuard.canActivate(mockRequest))
        .resolves
        .toEqual(true);
      expect(mockTokenService.extractToken).toHaveBeenCalledWith(mockRequest);
      expect(mockTokenService.verify).toHaveBeenCalledWith(token);
      expect(mockTokenService.decode).toHaveBeenCalledWith(token);
    });
  })
});
