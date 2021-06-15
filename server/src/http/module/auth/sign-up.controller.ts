import { Request, Response } from 'express';
import { Controller, Post, Req, Res } from "@nestjs/common";

import { SignUpService } from "./sign-up.service";
import { buildErrorResponse } from "@app/shared/error";
import { LoggerService } from "@app/log";

@Controller()
export class SignUpController {
  constructor(
    private readonly signUpService: SignUpService,
    private readonly logger: LoggerService,
  ) { }

  @Post('/auth/sign-up')
  public async signUp(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const data = await this.signUpService.signUp(req.body);
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}
