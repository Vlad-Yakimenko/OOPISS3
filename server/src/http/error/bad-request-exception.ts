import { HttpStatusCode, HttpMessageResponse } from "../enum";
import { HttpException } from "./http-exception";

export class BadRequestException extends HttpException {
  public code: number = HttpStatusCode.BadRequestError;

  constructor(message: string = HttpMessageResponse.BadRequestError) {
    super(message);
  }
}