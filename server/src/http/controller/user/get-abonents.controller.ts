import { HttpMethodName } from "@app/http/enum";
import { GetAbonentsService } from "@app/http/service/user";
import { AbstractController } from "../controller.abstract";
import { Request, Response } from '@app/http';
import { ILogger, Logger } from "@app/log";
import { buildErrorResponse } from "@app/http/error";

export class GetAbonentsController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.GET;
  protected readonly url: string = '/user';

  constructor(
    private readonly getAbonentsService: GetAbonentsService = new GetAbonentsService(),
    private readonly logger: ILogger = new Logger(),
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this.getAbonentsService.getAbonents();
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}