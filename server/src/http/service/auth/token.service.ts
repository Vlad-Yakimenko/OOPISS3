import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './interface';
import { Request } from '@app/http';
import { UnauthorizedException } from '@app/http/error';

export class TokenService {
  private readonly jwtSecretKey: string = process.env.JWT_SECRET_KEY;

  constructor() { }

  public sign(jwtPayload: JwtPayload): string {
    return jwt.sign(jwtPayload, this.jwtSecretKey);
  }

  public verify(token: string): boolean {
    try {
      jwt.verify(token, this.jwtSecretKey, {
        ignoreExpiration: true,
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  public decode(token: string): JwtPayload {
    const decodedToken = jwt.verify(token, this.jwtSecretKey, {
      ignoreExpiration: true,
    }) as JwtPayload;
    return decodedToken;
  }

  public extractToken(req: Request): string {
    const bearerToken: string = req.headers['authorization'];
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token is missing');
    }
    return bearerToken.split(' ')[1];
  }
}
