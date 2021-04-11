import { Response, Request } from './';
import { HealthCheckController } from './controller/health-check.controller';
import { HttpMethodName } from './enum';
import { getBaseUrl } from '@app/helper';
import { SignUpController } from './controller/auth';
import { ILogger, Logger } from '@app/log';

export interface IRouteDispatcher {
  dispatch(req: Request, res: Response): Promise<any>;
}

export class RouteDispatcher implements IRouteDispatcher {
  constructor(
    private readonly logger: ILogger = new Logger(),
    private readonly healthCheckController: HealthCheckController = new HealthCheckController(),
    private readonly signUpController: SignUpController = new SignUpController(),
  ) { }

  public async dispatch(req: Request, res: Response): Promise<any> {
    const { url, method } = req;
    const baseUrl = getBaseUrl(url);

    this.logger.info('Handling request on the route:', method, url);

    if (baseUrl == '/' && method == HttpMethodName.GET) {
      return this.healthCheckController.handle(req, res);
    }

    if (baseUrl == '/auth/sign-up' && method == HttpMethodName.POST) {
      return this.signUpController.handle(req, res);
    }

    return null;
  }
}