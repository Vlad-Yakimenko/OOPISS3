import {
  BadRequestException, buildErrorResponse,
  ForbiddenException,
} from '@app/http/error';
import {
  genRandomInt, genRandomString
} from '@test/random';
import { AddUserTariffsController } from './add-user-tariffs.controller';

describe('`AddUserTariffsController`', () => {
  let addUserTariffsController: AddUserTariffsController;
  const mockAddUserTariffsService = {
    addTariffs: jest.fn(),
  };
  const mockLogger = {
    error: jest.fn(),
  };
  const mockAuthGuard = {
    canActivate: jest.fn(),
  };

  beforeEach(() => {
    addUserTariffsController = new AddUserTariffsController(
      mockAddUserTariffsService as any,
      mockLogger as any,
      mockAuthGuard as any,
    );
  });

  it('should be instance of `AddUserTariffsController`', () => {
    expect(addUserTariffsController).toBeInstanceOf(AddUserTariffsController);
    expect(new AddUserTariffsController()).toBeInstanceOf(AddUserTariffsController);
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

      await expect(addUserTariffsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockAddUserTariffsService.addTariffs).not.toHaveBeenCalled();
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
      mockAddUserTariffsService.addTariffs.mockResolvedValue(data);

      await expect(addUserTariffsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(data);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockAddUserTariffsService.addTariffs).toHaveBeenCalledWith(mockRequest.body);
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

      mockAddUserTariffsService.addTariffs.mockRejectedValue(httpException);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(addUserTariffsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockAddUserTariffsService.addTariffs).toHaveBeenCalledWith(mockRequest.body);
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

      mockAddUserTariffsService.addTariffs.mockRejectedValue(error);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(addUserTariffsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockAddUserTariffsService.addTariffs).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});
