import { ServerResponse } from 'http';

export class Response {
  constructor(
    private readonly internalResponse: ServerResponse
  ) { }

  public json(data: Record<string, any>): Response {
    this.internalResponse.setHeader('Content-Type', 'application/json');
    this.internalResponse.end(JSON.stringify(data));
    return this;
  }

  public setHeader(header: { name: string, value: string }): Response {
    const { name, value } = header;
    this.internalResponse.setHeader(name, value);
    return this;
  }

  public setHeaders(headers: Array<{ name: string, value: string }>): Response {
    headers.forEach((header) => {
      this.internalResponse.setHeader(header.name, header.value);
    });
    return this;
  }

  public status(statusCode: number): Response {
    this.internalResponse.statusCode = statusCode;
    return this;
  }
}
