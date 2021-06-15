import { HttpMessageResponse, HttpStatusCode } from "../enum";
import { HttpException } from "./http-exception";

export class ForbiddenException extends HttpException {
  public code: number = HttpStatusCode.ForbiddenError;
  public reason: HttpMessageResponse = HttpMessageResponse.ForbiddenError;

  constructor(message: string) {
    super(message);
  }
}