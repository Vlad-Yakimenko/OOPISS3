import {
  BadRequestException, buildErrorResponse,
  ForbiddenException,
} from '@app/shared/error';
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
    );
  });

  it('should be instance of `GetCallingsController`', () => {
    expect(getCallingsController).toBeInstanceOf(GetCallingsController);
  });

  describe('`getCallings`', () => {
    it('should return status 200 and json from a service if user provided correct data', async () => {
      const mockRequest = {
        url: 'url',
        query: {
          userId: genRandomInt().toString(),
        }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const data = {};

      mockAuthGuard.canActivate.mockResolvedValueOnce(true);
      mockGetCallingsService.getCallings.mockResolvedValueOnce(data);

      await expect(getCallingsController.getCallings(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(data);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockGetCallingsService.getCallings).toHaveBeenCalledWith(parseInt(mockRequest.query.userId));
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(data);
    });

    it('should handle `BadRequestException` if user provided query params', async () => {
      const mockRequest = {
        url: 'url',
        query: {}
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const httpException = new BadRequestException('Provide correct `userId` query param');
      const errorResponse = buildErrorResponse(httpException);

      await expect(getCallingsController.getCallings(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockAuthGuard.canActivate).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetCallingsService.getCallings).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(httpException.code);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
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

      mockGetCallingsService.getCallings.mockRejectedValueOnce(httpException);
      mockAuthGuard.canActivate.mockResolvedValueOnce(true);

      await expect(getCallingsController.getCallings(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetCallingsService.getCallings).toHaveBeenCalledWith(parseInt(mockRequest.query.userId));
      expect(mockResponse.status).toHaveBeenCalledWith(httpException.code);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });

    it('should handle error and return default error response if something unexpected happened', async () => {
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
      const error = new Error('test_error');
      const errorResponse = buildErrorResponse(error);

      mockGetCallingsService.getCallings.mockRejectedValueOnce(error);
      mockAuthGuard.canActivate.mockResolvedValueOnce(true);

      await expect(getCallingsController.getCallings(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetCallingsService.getCallings).toHaveBeenCalledWith(parseInt(mockRequest.query.userId));
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});
