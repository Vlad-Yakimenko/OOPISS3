import { HttpMethodName } from "@app/http/enum";
import { Request, Response } from '@app/http';
import { AbstractController } from "@app/http/controller/controller.abstract";
import { buildErrorResponse } from "@app/http/error";
import { GetTariffsService } from "@app/http/service/tariff";
import { ILogger, Logger } from "@app/log";
import { getQueryParams } from "@app/helper";

export class GetTariffsController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.GET;
  protected readonly url: string = '/tariff';

  constructor(
    private readonly getTariffsService: GetTariffsService = new GetTariffsService(),
    private readonly logger: ILogger = new Logger(),
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = getQueryParams(req.url);
      const data = await this.getTariffsService.getAllTariffs(userId);
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}