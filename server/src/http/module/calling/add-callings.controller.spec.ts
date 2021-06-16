import {
  BadRequestException, buildErrorResponse,
  ForbiddenException,
} from '@app/shared/error';
import { AddCallingsController } from './add-callings.controller';

describe('`AddCallingsController`', () => {
  let addCallingsController: AddCallingsController;
  const mockAddCallingsService = {
    addCallings: jest.fn(),
  };
  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(() => {
    addCallingsController = new AddCallingsController(
      mockAddCallingsService as any,
      mockLogger as any,
    );
  });

  it('should be instance of `AddCallingsController`', () => {
    expect(addCallingsController).toBeInstanceOf(AddCallingsController);
  });

  describe('`handle`', () => {
    it('should return status 200 and json from a service if user provided correct data', async () => {
      const mockRequest = {
        body: {},
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      const data = {};

      mockAddCallingsService.addCallings.mockResolvedValue(data);

      await expect(addCallingsController.addCallings(
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

      await expect(addCallingsController.addCallings(
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

      await expect(addCallingsController.addCallings(
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
