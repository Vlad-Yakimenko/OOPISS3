const mockHelpers = {
  getQueryParams: jest.fn(),
};
jest.mock('@app/helper', () => mockHelpers);

import {
  BadRequestException, buildErrorResponse,
  ForbiddenException
} from '@app/http/error';
import {
  genRandomInt, genRandomString
} from '@test/random';
import { GetUsersController } from './get-users.controller';

describe('`GetUsersController`', () => {
  let getUsersController: GetUsersController;
  const mockGetUsersService = {
    getAbonents: jest.fn(),
    getUserById: jest.fn(),
    getUserByPhone: jest.fn(),
  };
  const mockLogger = {
    error: jest.fn(),
  };
  const mockAuthGuard = {
    canActivate: jest.fn(),
  };

  beforeEach(() => {
    getUsersController = new GetUsersController(
      mockGetUsersService as any,
      mockLogger as any,
      mockAuthGuard as any,
    );
  });

  it('should be instance of `GetUsersController`', () => {
    expect(getUsersController).toBeInstanceOf(GetUsersController);
    expect(new GetUsersController()).toBeInstanceOf(GetUsersController);
  });

  describe('`handle`', () => {
    it('should handle `BadRequestException` if no any required query params were provided', async () => {
      const mockRequest = {
        url: 'url',
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const queryParams = {};
      const httpException = new BadRequestException('Provide either `onlyAbonents`, `userId` or `phone` query param');
      const errorResponse = buildErrorResponse(httpException);

      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(getUsersController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
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
      const queryParams = {};
      const httpException = new ForbiddenException('You can not make this action');
      const errorResponse = buildErrorResponse(httpException);

      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      mockAuthGuard.canActivate.mockResolvedValue(false);

      await expect(getUsersController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
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
        phone: genRandomString(),
      };
      const data = {};

      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      mockAuthGuard.canActivate.mockResolvedValue(true);
      mockGetUsersService.getUserByPhone.mockResolvedValue(data);

      await expect(getUsersController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(data);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockGetUsersService.getUserByPhone).toHaveBeenCalledWith(queryParams.phone);
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

      mockGetUsersService.getUserById.mockRejectedValue(httpException);
      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(getUsersController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetUsersService.getUserById).toHaveBeenCalledWith(queryParams.userId);
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
        onlyAbonents: true,
      };
      const error = new Error('test_error');
      const errorResponse = buildErrorResponse(error);

      mockGetUsersService.getAbonents.mockRejectedValue(error);
      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(getUsersController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetUsersService.getAbonents).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});
