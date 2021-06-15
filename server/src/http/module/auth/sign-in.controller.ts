import { Request, Response } from 'express';
import { Controller, Post, Req, Res } from "@nestjs/common";

import { buildErrorResponse } from "@app/shared/error";
import { SignInService } from "./sign-in.service";
import { LoggerService } from "@app/log";

@Controller()
export class SignInController {
  constructor(
    private readonly signInService: SignInService,
    private readonly logger: LoggerService,
  ) { }

  @Post('/auth/sign-in')
  public async signIn(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const data = await this.signInService.signIn(req.body);
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}
