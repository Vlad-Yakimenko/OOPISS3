import { HttpMethodName } from "@app/http/enum";
import { buildErrorResponse, ForbiddenException } from "@app/http/error";
import { AddUserTariffsService } from "@app/http/service/user";
import { ILogger, Logger } from "@app/log";
import { AbstractController } from "../controller.abstract";
import { Request, Response } from '@app/http';
import { AuthGuard } from "@app/http/guard";

export class AddUserTariffsController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.POST;
  protected readonly url: string = '/user/add-tariffs';

  constructor(
    private readonly addUserTariffsService: AddUserTariffsService = new AddUserTariffsService(),
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
      
      const data = await this.addUserTariffsService.addTariffs(req.body);
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}