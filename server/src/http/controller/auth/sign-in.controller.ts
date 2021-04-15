import { HttpMethodName } from "@app/http/enum";
import { AbstractController } from "../controller.abstract";
import { Request, Response } from '@app/http';
import { buildErrorResponse } from "@app/http/error";
import { SignInService } from "@app/http/service/auth";
import { ILogger, Logger } from "@app/log";

export class SignInController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.POST;
  protected readonly url: string = '/auth/sign-in';

  constructor(
    private readonly signInService: SignInService = new SignInService(),
    private readonly logger: ILogger = new Logger(),
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
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
