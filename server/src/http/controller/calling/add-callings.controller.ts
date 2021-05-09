import { AuthGuard } from '@app/http/guard';
import { HttpMethodName } from "@app/http/enum";
import { Request, Response } from '@app/http';
import { AbstractController } from "../controller.abstract";
import { AddCallingsService } from "@app/http/service/calling";
import { ILogger, Logger } from "@app/log";
import { buildErrorResponse, ForbiddenException } from "@app/http/error";

export class AddCallingsController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.POST;
  protected readonly url: string = '/calling';

  constructor(
    private readonly addCallingsService: AddCallingsService = new AddCallingsService(),
    private readonly logger: ILogger = new Logger(),
    private readonly authGuard: AuthGuard = new AuthGuard(),
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const isAuthorized: boolean = await this.authGuard.canActivate(req, req.body.userId);

      if (!isAuthorized) {
        throw new ForbiddenException('You can not make this action');
      }
      
      const data = await this.addCallingsService.addCallings(req.body);
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}