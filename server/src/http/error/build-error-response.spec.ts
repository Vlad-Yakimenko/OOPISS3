import { genRandomString } from "@test/random";
import { HttpMessageResponse, HttpStatusCode } from "../enum";
import { BadRequestException } from "./bad-request-exception";
import { buildErrorResponse } from "./build-error-response";

describe('`buildErrorResponse`', () => {
  it('should build error json with HttpException fields', () => {
    const someHttpException = new BadRequestException(); // it could be any HttpException
    const errResponse = buildErrorResponse(someHttpException); 

    expect(errResponse).toMatchObject({
      code: someHttpException.code,
      message: someHttpException.message,
      reason: someHttpException.reason,
    });
  });

  it('should build error json with default values if provided not HttpException', () => {
    const errMessage = genRandomString(10);
    const someError = new Error(errMessage);

    const errResponse = buildErrorResponse(someError);

    expect(errResponse).toMatchObject({
      code: HttpStatusCode.InternalServerError,
      message: someError.message,
      reason: HttpMessageResponse.InternalServerError,
    });
  });
});