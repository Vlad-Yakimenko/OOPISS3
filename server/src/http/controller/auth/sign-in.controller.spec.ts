import { SignInDto } from '@app/dto/auth';
import { 
  buildErrorResponse, NotFoundException 
} from "@app/http/error";
import { SignInController } from "./sign-in.controller";

describe('`SignInController`', () => {
  let signInController: SignInController;
  const mockSignInService = {
    signIn: jest.fn(),
  };
  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(() => {
    signInController = new SignInController(
      mockSignInService as any,
      mockLogger as any
    );
  });

  it('should be instance of `SignInController`', () => {
    expect(signInController).toBeInstanceOf(SignInController);
    expect(new SignInController()).toBeInstanceOf(SignInController);
  });

  describe('`handle`', () => {
    it('should return status 200 and json from a service if user provided correct data', async () => {
      const signInDto: SignInDto = {
        username: 'correct_username',
        password: 'correct_password',
      };
      const mockRequest = {
        body: signInDto,
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const data = {};

      mockSignInService.signIn.mockResolvedValue(data);
      await expect(signInController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(data);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockSignInService.signIn).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(data);
    });

    it('should handle `HttpException` from a service if user provided incorrect data', async () => {
      const signInDto: SignInDto = {
        username: 'incorrect_username',
        password: 'incorrect_password',
      };
      const mockRequest = {
        body: signInDto,
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const httpException = new NotFoundException('test_exception'); //could be any HttpException
      const errorResponse = buildErrorResponse(httpException);

      mockSignInService.signIn.mockRejectedValue(httpException);
      await expect(signInController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockSignInService.signIn).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(httpException.code);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    }); 

    it('should handle error and return default error response if something unexpected happened', async () => {
      const signInDto: SignInDto = {
        username: 'username',
        password: 'password',
      };
      const mockRequest = {
        body: signInDto,
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const error = new Error('test_error'); 
      const errorResponse = buildErrorResponse(error);

      mockSignInService.signIn.mockRejectedValue(error);
      await expect(signInController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockSignInService.signIn).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});