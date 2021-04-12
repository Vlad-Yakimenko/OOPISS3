import { HttpMethodName } from "../enum";
import { Request } from "../request.interface";
import { HealthCheckService } from "../service/health-check.service";
import { AbstractController } from "./controller.abstract";
import { Response } from '../response';

export class HealthCheckController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.GET;
  protected readonly url: string = '/';

  constructor(
    private readonly healthCheckService: HealthCheckService = new HealthCheckService(),
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    const data = this.healthCheckService.healthCheck();
    return res.status(200).json(data);
  }
}
