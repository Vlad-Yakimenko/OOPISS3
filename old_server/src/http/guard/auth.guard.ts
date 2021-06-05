import { UnauthorizedException } from '../error';
import { JwtPayload } from '../service/auth/interface';
import { TokenService } from '../service/auth';
import { Request } from '../request.interface';
import { Role } from '@app/entity/enum';
import { UserRepository } from '@app/repository';

export class AuthGuard {
  constructor(
    private readonly tokenService: TokenService = new TokenService(),
    private readonly userRepository: UserRepository = new UserRepository(),
  ) { }

  public async canActivate(req: Request, userId?: number | string, phone?: string): Promise<boolean> {
    const token: string = this.tokenService.extractToken(req);

    if (!this.tokenService.verify(token)) {
      throw new UnauthorizedException('Token is invalid');
    }

    const jwtPayload: JwtPayload = this.tokenService.decode(token);

    if (userId && jwtPayload.role !== Role.Admin && userId != jwtPayload.userId) {
      return false;
    }

    if (phone && jwtPayload.role !== Role.Admin) {
      const user = await this.userRepository.findByPhone(phone);
      return user ? user.id == jwtPayload.userId : false;
    }

    return true;
  }
}