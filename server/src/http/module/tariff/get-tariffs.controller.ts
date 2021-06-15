import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";

import { LoggerService } from "@app/log";
import { GetTariffsService } from "./get-tariffs.service";
import { buildErrorResponse } from "@app/shared/error";
import { AuthGuard } from "@app/http/guard";
import { Roles } from "@app/shared/decorator";
import { Role } from "@app/db/entity/enum";

@Controller()
@UseGuards(AuthGuard)
export class GetTariffsController {
  constructor(
    private readonly getTariffsService: GetTariffsService,
    private readonly logger: LoggerService,
  ) { }

  @Get('/tariff')
  @Roles(Role.Abonent, Role.Admin)
  public async getTariffs(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const { userId } = req.query;

      if (userId && typeof userId === 'string') {
        const data = await this.getTariffsService.getAllTariffs(parseInt(userId));
        return res.status(200).json(data);
      }

      const data = await this.getTariffsService.getAllTariffs();
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}