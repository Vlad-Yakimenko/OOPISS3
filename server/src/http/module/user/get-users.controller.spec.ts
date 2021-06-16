import {
  BadRequestException, buildErrorResponse,
  ForbiddenException
} from '@app/shared/error';
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

  beforeEach(() => {
    getUsersController = new GetUsersController(
      mockGetUsersService as any,
      mockLogger as any,
    );
  });

  it('should be instance of `GetUsersController`', () => {
    expect(getUsersController).toBeInstanceOf(GetUsersController);
  });

  describe('`handle`', () => {
    it('should handle `BadRequestException` if no any required query params were provided', async () => {
      const mockRequest = {
        url: 'url',
        query: {},
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const httpException = new BadRequestException('Provide either `onlyAbonents`, `userId` or `phone` query param');
      const errorResponse = buildErrorResponse(httpException);

      await expect(getUsersController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockResponse.status).toHaveBeenCalledWith(httpException.code);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });

    it('should return status 200 and json from a service if user provided correct data', async () => {
      const mockRequest = {
        url: 'url',
        query: {
          phone: genRandomString(),
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const data = {};

      mockGetUsersService.getUserByPhone.mockResolvedValue(data);

      await expect(getUsersController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(data);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockGetUsersService.getUserByPhone).toHaveBeenCalledWith(mockRequest.query.phone);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(data);
    });

    it('should handle `HttpException` from a service if user provided incorrect data', async () => {
      const mockRequest = {
        url: 'url',
        query: {
          userId: genRandomInt().toString(),
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const httpException = new BadRequestException('test_exception'); //could be any HttpException
      const errorResponse = buildErrorResponse(httpException);

      mockGetUsersService.getUserById.mockRejectedValue(httpException);

      await expect(getUsersController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetUsersService.getUserById).toHaveBeenCalledWith(parseInt(mockRequest.query.userId));
      expect(mockResponse.status).toHaveBeenCalledWith(httpException.code);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });

    it('should handle error and return default error response if something unexpected happened', async () => {
      const mockRequest = {
        url: 'url',
        query: {
          onlyAbonents: true,
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const error = new Error('test_error');
      const errorResponse = buildErrorResponse(error);

      mockGetUsersService.getAbonents.mockRejectedValue(error);

      await expect(getUsersController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetUsersService.getAbonents).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});
