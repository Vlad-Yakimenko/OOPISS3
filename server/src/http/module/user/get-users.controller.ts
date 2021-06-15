import { Request, Response } from 'express';
import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";

import { LoggerService } from "@app/log";
import {
  BadRequestException, buildErrorResponse,
  ForbiddenException,
} from "@app/shared/error";
import { GetUsersService } from "./get-users.service";
import { AuthGuard } from '@app/http/guard';
import { Roles } from '@app/shared/decorator';
import { Role } from '@app/db/entity/enum';

@Controller()
@UseGuards(AuthGuard)
export class GetUsersController {
  constructor(
    private readonly getUsersService: GetUsersService,
    private readonly logger: LoggerService,
  ) { }

  @Get('/user')
  @Roles(Role.Abonent, Role.Admin)
  public async handle(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const { onlyAbonents, userId, phone } = req.query;

      if (onlyAbonents) {
        return res.status(200).json(await this.getUsersService.getAbonents());
      }

      if (userId && typeof userId === 'string') {
        return res.status(200).json(await this.getUsersService.getUserById(parseInt(userId)));
      }

      if (phone && typeof phone === 'string') {
        return res.status(200).json(await this.getUsersService.getUserByPhone(phone));
      }

      throw new BadRequestException('Provide either `onlyAbonents`, `userId` or `phone` query param');
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}