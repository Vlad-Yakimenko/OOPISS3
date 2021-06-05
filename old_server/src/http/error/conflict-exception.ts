import { HttpStatusCode, HttpMessageResponse } from "../enum";
import { HttpException } from "./http-exception";

export class ConflictException extends HttpException {
  public code: number = HttpStatusCode.ConflictError;
  public reason: HttpMessageResponse = HttpMessageResponse.ConflictError;

  constructor(message: string) {
    super(message);
  }
}