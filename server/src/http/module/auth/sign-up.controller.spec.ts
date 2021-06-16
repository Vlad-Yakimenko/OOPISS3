import { SignUpDto } from '@app/shared/dto/auth';
import { Country, Currency } from '@app/db/entity/enum';
import {
  buildErrorResponse, ConflictException,
} from "@app/shared/error";
import { genRandomString } from '@test/random';
import { SignUpController } from "./sign-up.controller";

describe('`SignUpController`', () => {
  let signUpController: SignUpController;
  const mockSignUpService = {
    signUp: jest.fn(),
  };
  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(() => {
    signUpController = new SignUpController(
      mockSignUpService as any,
      mockLogger as any
    );
  });

  it('should be instance of `SignUpController`', () => {
    expect(signUpController).toBeInstanceOf(SignUpController);
  });

  describe('`signUp`', () => {
    it('should return status 200 and json from a service if user provided correct data', async () => {
      const signUpDto: SignUpDto = {
        phone: genRandomString(),
        password: genRandomString(),
        country: Country.Ukraine,
        currency: Currency.UAH,
      };
      const mockRequest = {
        body: signUpDto,
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const data = {};

      mockSignUpService.signUp.mockResolvedValue(data);
      await expect(signUpController.signUp(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(data);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockSignUpService.signUp).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(data);
    });

    it('should handle `HttpException` from a service if user provided incorrect credentials', async () => {
      const signUpDto: SignUpDto = {
        phone: genRandomString(),
        password: genRandomString(),
        country: Country.Ukraine,
        currency: Currency.UAH,
      };
      const mockRequest = {
        body: signUpDto,
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const httpException = new ConflictException('test_exception'); //could be any HttpException
      const errorResponse = buildErrorResponse(httpException);

      mockSignUpService.signUp.mockRejectedValue(httpException);
      await expect(signUpController.signUp(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockSignUpService.signUp).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(httpException.code);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });

    it('should handle error and return default error response if something unexpected happened', async () => {
      const signUpDto: SignUpDto = {
        phone: genRandomString(),
        password: genRandomString(),
        country: Country.Ukraine,
        currency: Currency.UAH,
      };
      const mockRequest = {
        body: signUpDto,
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const error = new Error('test_error');
      const errorResponse = buildErrorResponse(error);

      mockSignUpService.signUp.mockRejectedValue(error);
      await expect(signUpController.signUp(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockSignUpService.signUp).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});
