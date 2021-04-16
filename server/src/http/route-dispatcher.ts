import { Response, Request } from './';
import { HealthCheckController } from './controller/health-check.controller';
import { HttpMethodName } from './enum';
import { getBaseUrl } from '@app/helper';
import { SignInController, SignUpController } from './controller/auth';
import { ILogger, Logger } from '@app/log';
import { 
  ChangeUserBalanceController, ChangeUserStatusController, 
  GetAbonentsController,
} from './controller/user';

export interface IRouteDispatcher {
  dispatch(req: Request, res: Response): Promise<Response | null>;
}

export class RouteDispatcher implements IRouteDispatcher {
  constructor(
    private readonly logger: ILogger = new Logger(),
    private readonly healthCheckController: HealthCheckController = new HealthCheckController(),
    private readonly signUpController: SignUpController = new SignUpController(),
    private readonly signInController: SignInController = new SignInController(),
    private readonly getAbonentsController: GetAbonentsController = new GetAbonentsController(),
    private readonly changeUserStatusController: ChangeUserStatusController = new ChangeUserStatusController(),
    private readonly changeUserBalanceController: ChangeUserBalanceController = new ChangeUserBalanceController(),
  ) { }

  public async dispatch(req: Request, res: Response): Promise<Response | null> {
    const { url, method } = req;
    const baseUrl = getBaseUrl(url);

    this.logger.info('Handling request on the route:', method, url);

    if (baseUrl === '/' && method === HttpMethodName.GET) {
      return this.healthCheckController.handle(req, res);
    }

    if (baseUrl === '/auth/sign-up' && method === HttpMethodName.POST) {
      return this.signUpController.handle(req, res);
    }

    if (baseUrl === '/auth/sign-in' && method === HttpMethodName.POST) {
      return this.signInController.handle(req, res);
    }

    if (baseUrl === '/user' && method === HttpMethodName.GET) {
      return this.getAbonentsController.handle(req, res);
    }

    if (baseUrl === '/user/change-status' && method === HttpMethodName.POST) {
      return this.changeUserStatusController.handle(req, res);
    }

    if (baseUrl === '/user/change-balance' && method === HttpMethodName.POST) {
      return this.changeUserBalanceController.handle(req, res);
    }

    return null;
  }
}