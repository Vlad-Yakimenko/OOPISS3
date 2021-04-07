import { HttpMessageResponse, HttpStatusCode } from "../enum";
import { HttpException } from "./http-exception";

export class InternalServerException extends HttpException {
  public code: number = HttpStatusCode.InternalServerError;

  constructor(message: string = HttpMessageResponse.InternalServerError) {
    super(message);
  }
}
