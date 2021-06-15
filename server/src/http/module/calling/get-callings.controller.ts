import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from 'express';

import { HttpMethodName } from "@app/shared/enum";
import { GetCallingsService } from "./get-callings.service";
import { LoggerService } from "@app/log";
import {
  BadRequestException, buildErrorResponse,
  ForbiddenException,
} from "@app/shared/error";
import { AuthGuard } from "@app/http/guard";
import { Roles } from "@app/shared/decorator";
import { Role } from "@app/db/entity/enum";

@Controller()
@UseGuards(AuthGuard)
export class GetCallingsController {
  constructor(
    private readonly getCallingsService: GetCallingsService,
    private readonly logger: LoggerService,
  ) { }

  @Get('/calling')
  @Roles(Role.Abonent, Role.Admin)
  public async getCallings(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        throw new BadRequestException('Provide correct `userId` query param');
      }
      
      const data = await this.getCallingsService.getCallings(parseInt(userId));
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}
