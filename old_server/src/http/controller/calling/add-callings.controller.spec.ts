import {
  BadRequestException, buildErrorResponse,
  ForbiddenException,
} from '../../error';
import {
  genRandomInt, genRandomString
} from '../../../../test/random';
import { AddCallingsController } from './add-callings.controller';

describe('`AddCallingsController`', () => {
  let addCallingsController: AddCallingsController;
  const mockAddCallingsService = {
    addCallings: jest.fn(),
  };
  const mockLogger = {
    error: jest.fn(),
  };
  const mockAuthGuard = {
    canActivate: jest.fn(),
  };

  beforeEach(() => {
    addCallingsController = new AddCallingsController(
      mockAddCallingsService as any,
      mockLogger as any,
      mockAuthGuard as any,
    );
  });

  it('should be instance of `AddCallingsController`', () => {
    expect(addCallingsController).toBeInstanceOf(AddCallingsController);
    expect(new AddCallingsController()).toBeInstanceOf(AddCallingsController);
  });

  describe('`handle`', () => {
    it('should handle `ForbiddenException` if user provided incorrect token', async () => {
      const mockRequest = {
        body: {},
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const httpException = new ForbiddenException('You can not make this action');
      const errorResponse = buildErrorResponse(httpException);

      mockAuthGuard.canActivate.mockResolvedValue(false);

      await expect(addCallingsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockAddCallingsService.addCallings).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(httpException.code);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });

    it('should return status 200 and json from a service if user provided correct data', async () => {
      const mockRequest = {
        body: {},
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const data = {};

      mockAuthGuard.canActivate.mockResolvedValue(true);
      mockAddCallingsService.addCallings.mockResolvedValue(data);

      await expect(addCallingsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(data);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockAddCallingsService.addCallings).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(data);
    });

    it('should handle `HttpException` from a service if user provided incorrect data', async () => {
      const mockRequest = {
        body: {},
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const httpException = new BadRequestException('test_exception'); //could be any HttpException
      const errorResponse = buildErrorResponse(httpException);

      mockAddCallingsService.addCallings.mockRejectedValue(httpException);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(addCallingsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockAddCallingsService.addCallings).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(httpException.code);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });

    it('should handle error and return default error response if something unexpected happened', async () => {
      const mockRequest = {
        body: {},
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const error = new Error('test_error');
      const errorResponse = buildErrorResponse(error);

      mockAddCallingsService.addCallings.mockRejectedValue(error);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(addCallingsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockAddCallingsService.addCallings).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});
