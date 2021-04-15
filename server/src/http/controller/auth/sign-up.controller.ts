import { HttpMethodName } from "@app/http/enum";
import { SignUpService } from "@app/http/service/auth";
import { AbstractController } from "../controller.abstract";
import { Request, Response } from '@app/http';
import { buildErrorResponse } from "@app/http/error";
import { ILogger, Logger } from "@app/log";

export class SignUpController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.POST;
  protected readonly url: string = '/auth/sign-up';

  constructor(
    private readonly signUpService: SignUpService = new SignUpService(),
    private readonly logger: ILogger = new Logger(),
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
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