const mockJwt = {
  sign: jest.fn(),
  verify: jest.fn(),
};
jest.mock('jsonwebtoken', () => mockJwt);

import * as jwt from 'jsonwebtoken';
import { TokenService } from "./token.service";
import { JwtPayload } from "./interface";
import { genRandomInt } from "@test/random";
import { Role } from "@app/entity/enum";
import { UnauthorizedException } from '@app/http/error';

describe('`TokenService`', () => {
  let tokenService: TokenService;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  beforeEach(() => {
    tokenService = new TokenService();
  });

  it('should be instance of `TokenService`', () => {
    expect(tokenService).toBeInstanceOf(TokenService);
  });

  describe('`sign`', () => {
    it('should sign token with provided secret key and payload', () => {
      const signedToken: string = 'signedToken';
      const jwtPayload: JwtPayload = {
        userId: genRandomInt(),
        role: Role.Abonent,
      };
      mockJwt.sign.mockReturnValue(signedToken);
      const token = tokenService.sign(jwtPayload);

      expect(token).toEqual(signedToken);
      expect(mockJwt.sign).toHaveBeenCalledWith(jwtPayload, jwtSecretKey);
    });
  });

  describe('`verify`', () => {
    it('should return true for valid token', () => {
      const validToken: string = 'validToken';
      mockJwt.verify.mockReturnValue(true);

      const isValidToken: boolean = tokenService.verify(validToken);
      expect(isValidToken).toBeTruthy();
      expect(mockJwt.verify).toHaveBeenCalledWith(validToken, jwtSecretKey, {
        ignoreExpiration: true,
      });
    });

    it('should return false for invalid token', () => {
      const invalidToken: string = 'invalidToken';
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid Token')
      });

      const isValidToken: boolean = tokenService.verify(invalidToken);
      expect(isValidToken).toBeFalsy();
      expect(mockJwt.verify).toHaveBeenCalledWith(invalidToken, jwtSecretKey, {
        ignoreExpiration: true,
      });
    });
  });

  describe('`decode`', () => {
    it('should decode provided token as object', () => {
      const token = 'token';
      const jwtPayload: JwtPayload = {
        userId: genRandomInt(),
        role: Role.Admin,
      };
      mockJwt.verify.mockReturnValue(jwtPayload);

      const decodedToken: JwtPayload = tokenService.decode(token);
      expect(decodedToken).toEqual(jwtPayload);
      expect(mockJwt.verify).toHaveBeenCalledWith(token, jwtSecretKey, {
        ignoreExpiration: true,
      });
    });
  });

  describe('`extractToken`', () => {
    it('should extract token from the request', () => {
      const token = 'token';
      const bearerToken: string = `Bearer ${token}`;
      const mockRequest = {
        headers: {
          'authorization': bearerToken,
        }
      } as any;

      const extractedToken: string = tokenService.extractToken(mockRequest);
      expect(extractedToken).toEqual(token);
    });

    it('should throw unauthorized exception if token does not exist', () => {
      const mockRequest = {
        headers: {
          // some headers
        }
      } as any;

      expect(() => {
        tokenService.extractToken(mockRequest)
      }).toThrow(UnauthorizedException);
    });

    it('should throw unauthorized exception if provided not bearer token', () => {
      const notBearerToken: string = 'token';
      const mockRequest = {
        headers: {
          'authorization': notBearerToken,
        }
      } as any;

      expect(() => {
        tokenService.extractToken(mockRequest)
      }).toThrow(UnauthorizedException);
    });
  });

});
