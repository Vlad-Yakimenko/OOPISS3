import { Role } from "@app/db/entity/enum";
import { UnauthorizedException } from "@app/shared/error";
import { AuthGuard } from "./auth.guard";


describe('`AuthGuard`', () => {
  let authGuard: AuthGuard;

  const mockReflector = {
    get: jest.fn(),
  };
  const mockTokenService = {
    extractToken: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  beforeEach(() => {
    authGuard = new AuthGuard(
      mockReflector as any,
      mockTokenService as any,
    );
  });

  it('should be instance of `AuthGuard`', () => {
    expect(authGuard).toBeInstanceOf(AuthGuard);
  });

  describe('`canActivate`', () => {
    it('should be truthy if no any roles were provided', async () => {
      const mockContext = {
        getHandler: jest.fn(),
      };
      await expect(authGuard.canActivate(mockContext as any)).resolves.toEqual(true);
    });

    it('should throw `UnauthorizedException` if token is not valid', async () => {
      mockReflector.get.mockReturnValue([]);
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValueOnce({ getRequest: jest.fn() })
      };
      await expect(authGuard.canActivate(mockContext as any))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should be falsy if user role does not exist in allowed roles', async () => {
      mockReflector.get.mockReturnValueOnce([]);
      mockTokenService.verify.mockReturnValueOnce(true);
      mockTokenService.decode.mockReturnValueOnce({ role: Role.Abonent });
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValueOnce({ getRequest: jest.fn() })
      };
      await expect(authGuard.canActivate(mockContext as any))
        .resolves
        .toEqual(false);
    });

    it('should be truthy if user role exists in allowed roles', async () => {
      mockReflector.get.mockReturnValueOnce([Role.Abonent]);
      mockTokenService.verify.mockReturnValueOnce(true);
      mockTokenService.decode.mockReturnValueOnce({ role: Role.Abonent });
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValueOnce({ getRequest: jest.fn() })
      };
      await expect(authGuard.canActivate(mockContext as any))
        .resolves
        .toEqual(true);
    });
  })
});
