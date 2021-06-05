import {
  BadRequestException, buildErrorResponse,
  ForbiddenException,
} from '@app/http/error';
import {
  genRandomInt, genRandomString
} from '@test/random';
import { ChangeUserStatusController } from './change-user-status.controller';

describe('`ChangeUserStatusController`', () => {
  let changeUserStatusController: ChangeUserStatusController;
  const mockChangeUserStatusService = {
    changeUserStatus: jest.fn(),
  };
  const mockLogger = {
    error: jest.fn(),
  };
  const mockAuthGuard = {
    canActivate: jest.fn(),
  };

  beforeEach(() => {
    changeUserStatusController = new ChangeUserStatusController(
      mockChangeUserStatusService as any,
      mockLogger as any,
      mockAuthGuard as any,
    );
  });

  it('should be instance of `ChangeUserStatusController`', () => {
    expect(changeUserStatusController).toBeInstanceOf(ChangeUserStatusController);
    expect(new ChangeUserStatusController()).toBeInstanceOf(ChangeUserStatusController);
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

      await expect(changeUserStatusController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockChangeUserStatusService.changeUserStatus).not.toHaveBeenCalled();
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
      mockChangeUserStatusService.changeUserStatus.mockResolvedValue(data);

      await expect(changeUserStatusController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(data);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockChangeUserStatusService.changeUserStatus).toHaveBeenCalledWith(mockRequest.body);
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

      mockChangeUserStatusService.changeUserStatus.mockRejectedValue(httpException);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(changeUserStatusController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockChangeUserStatusService.changeUserStatus).toHaveBeenCalledWith(mockRequest.body);
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

      mockChangeUserStatusService.changeUserStatus.mockRejectedValue(error);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(changeUserStatusController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockChangeUserStatusService.changeUserStatus).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});
