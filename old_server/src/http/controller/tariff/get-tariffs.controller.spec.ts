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
import { GetTariffsController } from './get-tariffs.controller';

describe('`GetTariffsController`', () => {
  let getTariffsController: GetTariffsController;
  const mockGetTariffsService = {
    getAllTariffs: jest.fn(),
  };
  const mockLogger = {
    error: jest.fn(),
  };
  const mockAuthGuard = {
    canActivate: jest.fn(),
  };

  beforeEach(() => {
    getTariffsController = new GetTariffsController(
      mockGetTariffsService as any,
      mockLogger as any,
      mockAuthGuard as any,
    );
  });

  it('should be instance of `GetTariffsController`', () => {
    expect(getTariffsController).toBeInstanceOf(GetTariffsController);
    expect(new GetTariffsController()).toBeInstanceOf(GetTariffsController);
  });

  describe('`handle`', () => {
    it('should handle `Forbidden Exception` if user provided incorrect token', async () => {
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

      await expect(getTariffsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetTariffsService.getAllTariffs).not.toHaveBeenCalled();
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
      mockGetTariffsService.getAllTariffs.mockResolvedValue(data);

      await expect(getTariffsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(data);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockGetTariffsService.getAllTariffs).toHaveBeenCalledWith(queryParams.userId);
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

      mockGetTariffsService.getAllTariffs.mockRejectedValue(httpException);
      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(getTariffsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetTariffsService.getAllTariffs).toHaveBeenCalledWith(queryParams.userId);
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

      mockGetTariffsService.getAllTariffs.mockRejectedValue(error);
      mockHelpers.getQueryParams.mockReturnValue(queryParams);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(getTariffsController.handle(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockHelpers.getQueryParams).toHaveBeenCalledWith(mockRequest.url);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetTariffsService.getAllTariffs).toHaveBeenCalledWith(queryParams.userId);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});
