const mockHelpers = {
  getQueryParams: jest.fn(),
};
jest.mock('@app/helper', () => mockHelpers);

import {
  BadRequestException, buildErrorResponse,
  ForbiddenException,
} from '../../error';
import {
  genRandomInt, genRandomString
} from '../../../../test/random';
import { GetCallingsController } from './get-callings.controller';

describe('`GetCallingsController`', () => {
  let getCallingsController: GetCallingsController;
  const mockGetCallingsService = {
    getCallings: jest.fn(),
  };
  const mockLogger = {
    error: jest.fn(),
  };
  const mockAuthGuard = {
    canActivate: jest.fn(),
  };

  beforeEach(() => {
    getCallingsController = new GetCallingsController(
      mockGetCallingsService as any,
      mockLogger as any,
      mockAuthGuard as any,
    );
  });

  it('should be instance of `GetCallingsController`', () => {
    expect(getCallingsController).toBeInstanceOf(GetCallingsController);
    expect(new GetCallingsController()).toBeInstanceOf(GetCallingsController);
  });

  describe('`handle`', () => {
    it('should handle `BadRequestException` if user provided query params', async () => {
      const mockRequest = {
        url: 'url',
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const queryParams = {};
      const httpException = new BadRequestException('Provide `userId` query param');
      const errorResponse = buildErrorResponse(httpException);
      
      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      await expect(getCallingsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockAuthGuard.canActivate).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetCallingsService.getCallings).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(httpException.code);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });

    it('should handle `ForbiddenException` if user provided incorrect token', async () => {
      const mockRequest = {
        url: 'url',
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const queryParams = {
        userId: genRandomInt(),
      };
      const httpException = new ForbiddenException('You can not make this action');
      const errorResponse = buildErrorResponse(httpException);

      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      mockAuthGuard.canActivate.mockResolvedValue(false);

      await expect(getCallingsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetCallingsService.getCallings).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(httpException.code);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });

    it('should return status 200 and json from a service if user provided correct data', async () => {
      const mockRequest = {
        url: 'url',
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const queryParams = {
        userId: genRandomInt(),
      };
      const data = {};

      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      mockAuthGuard.canActivate.mockResolvedValue(true);
      mockGetCallingsService.getCallings.mockResolvedValue(data);

      await expect(getCallingsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(data);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockGetCallingsService.getCallings).toHaveBeenCalledWith(queryParams.userId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(data);
    });

    it('should handle `HttpException` from a service if user provided incorrect data', async () => {
      const mockRequest = {
        url: 'url',
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const queryParams = {
        userId: genRandomInt(),
      };
      const httpException = new BadRequestException('test_exception'); //could be any HttpException
      const errorResponse = buildErrorResponse(httpException);

      mockGetCallingsService.getCallings.mockRejectedValue(httpException);
      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(getCallingsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetCallingsService.getCallings).toHaveBeenCalledWith(queryParams.userId);
      expect(mockResponse.status).toHaveBeenCalledWith(httpException.code);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });

    it('should handle error and return default error response if something unexpected happened', async () => {
      const mockRequest = {
        url: 'url',
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const queryParams = {
        userId: genRandomInt(),
      };
      const error = new Error('test_error');
      const errorResponse = buildErrorResponse(error);

      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      mockGetCallingsService.getCallings.mockRejectedValue(error);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(getCallingsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetCallingsService.getCallings).toHaveBeenCalledWith(queryParams.userId);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});
