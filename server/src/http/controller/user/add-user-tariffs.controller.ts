import { HttpMethodName } from "@app/http/enum";
import { buildErrorResponse } from "@app/http/error";
import { AddUserTariffsService } from "@app/http/service/user";
import { ILogger, Logger } from "@app/log";
import { AbstractController } from "../controller.abstract";
import { Request, Response } from '@app/http';

export class AddUserTariffsController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.POST;
  protected readonly url: string = '/user/add-tariffs';

  constructor(
    private readonly addUserTariffsService: AddUserTariffsService = new AddUserTariffsService(),
    private readonly logger: ILogger = new Logger(),
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this.addUserTariffsService.addTariffs(req.body);
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}