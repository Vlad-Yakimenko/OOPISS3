import { genRandomString } from "@test/random";
import { HttpMessageResponse, HttpStatusCode } from "../enum";
import { buildErrorResponse } from "./build-error-response";
import { InternalServerException } from "./internal-server-exception";

describe('`buildErrorResponse`', () => {
  it('should build error json with HttpException fields', () => {
    const message = 'test_exception';
    const someHttpException = new InternalServerException(message); // it could be any HttpException
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