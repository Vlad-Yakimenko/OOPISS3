import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from 'express';

import { ChangeUserBalanceService } from "./change-user-balance.service";
import { LoggerService } from "@app/log";
import { buildErrorResponse, ForbiddenException } from "@app/shared/error";
import { Roles } from "@app/shared/decorator";
import { AuthGuard } from "@app/http/guard";
import { Role } from "@app/db/entity/enum";

@Controller()
@UseGuards(AuthGuard)
export class ChangeUserBalanceController {
  constructor(
    private readonly changeUserBalanceService: ChangeUserBalanceService,
    private readonly logger: LoggerService,
  ) { }

  @Post('/user/change-balance')
  @Roles(Role.Abonent, Role.Admin)
  public async changeUserBalance(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const data = await this.changeUserBalanceService.changeUserBalance(req.body);
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}