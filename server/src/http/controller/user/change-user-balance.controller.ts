import { HttpMethodName } from "@app/http/enum";
import { ChangeUserBalanceService } from "@app/http/service/user";
import { AbstractController } from "../controller.abstract";
import { Request, Response } from '@app/http';
import { ILogger, Logger } from "@app/log";
import { buildErrorResponse } from "@app/http/error";

export class ChangeUserBalanceController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.POST;
  protected readonly url: string = '/user/change-balance';

  constructor(
    private readonly changeUserBalanceService: ChangeUserBalanceService = new ChangeUserBalanceService(),
    private readonly logger: ILogger = new Logger(),
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this.changeUserBalanceService.changeUserBalance(req.body);
      return res.status(200).json(data);
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}