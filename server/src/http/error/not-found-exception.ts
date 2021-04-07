import { HttpMessageResponse, HttpStatusCode } from "../enum";
import { HttpException } from "./http-exception";

export class NotFoundException extends HttpException {
  public code: number = HttpStatusCode.NotFoundError;

  constructor(message: string = HttpMessageResponse.NotFoundError) {
    super(message);
  }
}