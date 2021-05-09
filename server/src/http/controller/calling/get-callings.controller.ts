import { HttpMethodName } from "@app/http/enum";
import { Request, Response } from '@app/http';
import { AbstractController } from "../controller.abstract";
import { GetCallingsService } from "@app/http/service/calling";
import { ILogger, Logger } from "@app/log";
import { BadRequestException, buildErrorResponse, ForbiddenException } from "@app/http/error";
import { getQueryParams } from "@app/helper";
import { AuthGuard } from "@app/http/guard";

export class GetCallingsController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.GET;
  protected readonly url: string = '/calling';

  constructor(
    private readonly getCallingsService: GetCallingsService = new GetCallingsService(),
    private readonly logger: ILogger = new Logger(),
    private readonly authGuard: AuthGuard = new AuthGuard(),
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = getQueryParams(req.url);

      if (!userId) {
        throw new BadRequestException('Provide `userId` query param');
      }

      const isAuthorized: boolean = await this.authGuard.canActivate(req, userId);
      
      if (!isAuthorized) {
        throw new ForbiddenException('You can not make this action');
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