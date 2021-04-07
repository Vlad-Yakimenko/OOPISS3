export class HttpException extends Error {
  public readonly code: number;

  constructor(message: string) {
    super(message);
  }
}