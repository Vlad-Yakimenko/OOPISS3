import { ILogger } from '@app/log';
import http, { 
  IncomingMessage as IncomingRequest, 
  ServerResponse 
} from 'http';

export class Server {
  private httpServer: http.Server;

  constructor(private readonly logger: ILogger) {
    this.logger = logger;
  }

  public start(port: number, host: string): void {
    if (this.isInitialized()) {
      this.logger.error('Server was already initialized');
      return;
    }

    this.httpServer = http.createServer((req, res) => {
      this.handleEventErrors(req, res);
      this.processRequest(req, res);
    });

    this.httpServer.listen(
      port, host,
      () => this.logger.info(`Server is listening on port ${port} ...`)
    );
  }

  private processRequest(req: IncomingRequest, res: ServerResponse): void {
    const { headers, method, url } = req;
    let baseBody = { headers, method, url };

    this.retrieveRequestBody(req, (body) => {
      const resBody = { ...baseBody, body }; // TODO: controller execution result
      this.sendResponse(res, resBody, 200, { 'Content-Type': 'application/json' });
    });
  }

  private retrieveRequestBody(req: IncomingRequest, callback: (...args: any[]) => any): void {
    const bodyChunks = [];

    const hasRequestBody = (methodName: string): boolean => methodName !== 'GET';

    req.on('data', (chunk) => {
      bodyChunks.push(chunk);
    }).on('end', () => {
      const body = hasRequestBody(req.method)
        ? JSON.parse(Buffer.concat(bodyChunks).toString())
        : {};
      callback(body);
    });
  }

  private sendResponse(
    res: ServerResponse, data: Record<string, any>,
    statusCode: number, headers: Record<string, any>
  ): void {
    res.writeHead(statusCode, headers);
    res.end(JSON.stringify(data));
  }

  private handleEventErrors(req: IncomingRequest, res: ServerResponse): void {
    req.on('error', err => {
      this.logger.error('Error during request:', err.message);
      this.logger.error(err.stack);
    });

    res.on('error', err => {
      this.logger.error('Error during response:', err.message);
      this.logger.error(err.stack);
    });
  }

  private isInitialized(): boolean {
    return this.httpServer ? true : false;
  }
}
