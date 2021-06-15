import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { AddCallingsService } from './add-callings.service';
import { LoggerService } from "@app/log";
import { buildErrorResponse, ForbiddenException } from "@app/shared/error";
import { AuthGuard } from '@app/http/guard';
import { Roles } from '@app/shared/decorator';
import { Role } from '@app/db/entity/enum';

@Controller()
@UseGuards(AuthGuard)
export class AddCallingsController {
  constructor(
    private readonly addCallingsService: AddCallingsService,
    private readonly logger: LoggerService,
  ) { }

  @Post('/calling')
  @Roles(Role.Abonent, Role.Admin)
  public async addCallings(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const data = await this.addCallingsService.addCallings(req.body);
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}
