import { Response } from '../response';
import { HttpMethodName } from '../enum';
import { Request } from '../request.interface';


export abstract class AbstractController {
  protected readonly method: HttpMethodName;
  protected readonly url: string;

  public abstract handle(req: Request, res: Response): Promise<Response>;

  public getMethod(): HttpMethodName {
    return this.method;
  }

  public getUrl(): string {
    return this.url;
  }
}
