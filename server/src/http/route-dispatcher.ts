import { Response, Request } from './';
import { getBaseUrl } from '@app/helper';
import { ILogger, Logger } from '@app/log';
import { AppModule } from '@app/app.module';

export interface IRouteDispatcher {
  dispatch(req: Request, res: Response): Promise<Response | null>;
}

export class RouteDispatcher implements IRouteDispatcher {
  constructor(
    private readonly logger: ILogger = new Logger(),
    private readonly appModule: AppModule = new AppModule(),
  ) { }

  public async dispatch(req: Request, res: Response): Promise<Response | null> {
    const { url, method } = req;
    const baseUrl = getBaseUrl(url);

    this.logger.info('Handling request on the route:', method, url);

    const controller = this.appModule.findController(baseUrl, method);
    return controller.handle(req, res);
  }
}
