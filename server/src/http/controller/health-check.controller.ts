import { HttpMethodName } from "../enum";
import { Request } from "../request.interface";
import { HealthCheckService } from "../service/health-check.service";
import { AbstractController } from "./controller.abstract";
import { Response } from '../response';
import { ILogger, Logger } from "@app/log";

export class HealthCheckController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.GET;
  protected readonly url: string = '/';

  constructor(
    private readonly logger: ILogger = new Logger(),
    private readonly healthCheckService: HealthCheckService = new HealthCheckService()
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    this.logger.info('Handling request on the route:', req.method, req.url);
    const data = this.healthCheckService.healthCheck();
    return res.status(200).json(data);
  }
}
