import { HttpMethodName } from "@app/http/enum";
import { AbstractController } from "../controller.abstract";
import { Request, Response } from '@app/http';
import { ILogger, Logger } from "@app/log";
import { BadRequestException, buildErrorResponse } from "@app/http/error";
import { getQueryParams } from "@app/helper";
import { GetUsersService } from "@app/http/service/user";

export class GetUsersController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.GET;
  protected readonly url: string = '/user';

  constructor(
    private readonly getUsersService: GetUsersService = new GetUsersService(),
    private readonly logger: ILogger = new Logger(),
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { onlyAbonents, userId } = getQueryParams(req.url);

      if (onlyAbonents) {
        return res.status(200).json(await this.getUsersService.getAbonents());
      }

      if (userId) {
        return res.status(200).json(await this.getUsersService.getUserById(userId));
      }

      throw new BadRequestException('Provide either `onlyAbonents` or `userId` query param');
    } catch (err) {
      this.logger.error('Error on the route:', req.url);
      this.logger.error(err.message);
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}