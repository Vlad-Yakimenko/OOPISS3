import { HttpMessageResponse } from "../enum";

export class HttpException extends Error {
  public readonly code: number;
  public readonly reason: HttpMessageResponse;

  constructor(message: string) {
    super(message);
  }
}