import { HttpMessageResponse, HttpStatusCode } from "../enum";
import { HttpException } from "./http-exception";

export class UnauthorizedException extends HttpException {
  public code: number = HttpStatusCode.UnauthorizedError;
  public reason: HttpMessageResponse = HttpMessageResponse.UnauthorizedError;

  constructor(message: string) {
    super(message);
  }
}