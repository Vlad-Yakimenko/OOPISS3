import { HttpMessageResponse, HttpStatusCode } from "../enum";
import { ErrorResponse } from "./error-response";

export function buildErrorResponse(err: any): ErrorResponse {
  return {
    code: err.code || HttpStatusCode.InternalServerError,
    message: err.message,
    reason: err.reason || HttpMessageResponse.InternalServerError,
  }
}