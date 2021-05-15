import { HttpMethodName, HttpStatusCode } from "../enum";
import { Request } from "../request.interface";
import { AbstractController } from "./controller.abstract";
import { Response } from '../response';
import { buildErrorResponse, NotFoundException } from "../error";

export class NotFoundController extends AbstractController {
  protected readonly method: HttpMethodName;
  protected readonly url: string;

  constructor() {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    return res.status(HttpStatusCode.NotFoundError).json(
      buildErrorResponse(new NotFoundException('Page not found'))
    );
  }
}
