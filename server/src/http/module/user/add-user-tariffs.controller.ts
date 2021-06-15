import { Request, Response } from 'express';
import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { buildErrorResponse, ForbiddenException } from "@app/shared/error";
import { AddUserTariffsService } from "./add-user-tariffs.service";
import { LoggerService } from "@app/log";
import { AuthGuard } from '@app/http/guard';
import { Roles } from '@app/shared/decorator';
import { Role } from '@app/db/entity/enum';

@Controller()
@UseGuards(AuthGuard)
export class AddUserTariffsController {
  constructor(
    private readonly addUserTariffsService: AddUserTariffsService,
    private readonly logger: LoggerService,
  ) { }

  @Post('/user/add-tariffs')
  @Roles(Role.Abonent, Role.Admin)
  public async addUserTariffs(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const data = await this.addUserTariffsService.addTariffs(req.body);
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}