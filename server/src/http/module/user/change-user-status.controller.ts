import { Request, Response } from 'express';
import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";

import { ChangeUserStatusService } from "./change-user-status.service";
import { LoggerService } from "@app/log";
import { buildErrorResponse, ForbiddenException } from "@app/shared/error";
import { Roles } from '@app/shared/decorator';
import { AuthGuard } from '@app/http/guard';
import { Role } from '@app/db/entity/enum';

@Controller()
@UseGuards(AuthGuard)
export class ChangeUserStatusController {
  constructor(
    private readonly changeUserStatusService: ChangeUserStatusService,
    private readonly logger: LoggerService,
  ) { }

  @Post('/user/change-status')
  @Roles(Role.Admin)
  public async changeUserStatus(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const data = await this.changeUserStatusService.changeUserStatus(req.body);
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}