import { ILogger } from '@app/log';
import http, {
  IncomingMessage as IncomingRequest,
  ServerResponse
} from 'http';
import { HttpMethodName } from './enum';
import { IRouteDispatcher, Response } from './';

export class Server {
  private httpServer: http.Server;

  constructor(
    private readonly routeDispatcher: IRouteDispatcher,
    private readonly logger: ILogger,
  ) { }

  public start(port: number, host: string): void {
    if (this.isInitialized()) {
      this.logger.error('Server was already initialized');
      return;
    }

    this.httpServer = http.createServer((req, res) => {
      this.setCorsHeaders(res);
      
      if (req.method === HttpMethodName.OPTIONS) {
        res.writeHead(200);
        res.end();
        return;
      }

      this.handleEventErrors(req, res);
      this.processRequest(req, res);
    });

    this.httpServer.listen(
      port, host,
      () => this.logger.info(`Server is listening on port ${port} ...`)
    );
  }

  private setCorsHeaders(res: ServerResponse): void {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
  }

  private processRequest(req: IncomingRequest, res: ServerResponse): void {
    this.retrieveRequestBody(req, async (body) => {
      await this.routeDispatcher.dispatch({ ...req, body } as any, new Response(res));
    });
  }

  private handleEventErrors(req: IncomingRequest, res: ServerResponse): void {
    res.on('error', err => {
      this.logger.error('Error during response:', err.message);
      this.logger.error(err.stack);
    });
  }

  private retrieveRequestBody(req: IncomingRequest, callback: (...args: any[]) => any): void {
    const bodyChunks = [];

    const hasRequestBody = (methodName: string): boolean => {
      return methodName !== HttpMethodName.GET && methodName !== HttpMethodName.DELETE
        && methodName !== HttpMethodName.HEAD && methodName !== HttpMethodName.OPTIONS
    };

    req.on('data', (chunk) => {
      bodyChunks.push(chunk);
    }).on('end', () => {
      const body = hasRequestBody(req.method)
        ? JSON.parse(Buffer.concat(bodyChunks).toString())
        : {};
      callback(body);
    });
  }

  private isInitialized(): boolean {
    return this.httpServer ? true : false;
  }
}
