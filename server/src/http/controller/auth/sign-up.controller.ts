import { HttpMethodName } from "@app/http/enum";
import { SignUpService } from "@app/http/service/auth";
import { AbstractController } from "../controller.abstract";
import { Request, Response } from '@app/http';
import { buildErrorResponse } from "@app/http/error";

export class SignUpController extends AbstractController {
  protected readonly method: HttpMethodName = HttpMethodName.POST;
  protected readonly url: string = '/auth/sign-up';

  constructor(
    private readonly signUpService: SignUpService = new SignUpService(),
  ) {
    super();
  }

  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const newUser = await this.signUpService.signUp(req.body);
      return res.status(200).json(newUser);
    } catch (err) {
      return res.status(err.code || 500).json(buildErrorResponse(err));
    }
  }
}