import { 
  BadRequestException, buildErrorResponse, 
  ForbiddenException 
} from '@app/shared/error';
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
    );
  });

  it('should be instance of `GetTariffsController`', () => {
    expect(getTariffsController).toBeInstanceOf(GetTariffsController);
  });

  describe('`getTariffs`', () => {
    it('should return status 200 and json from a service if user provided correct data', async () => {
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
      const data = {};

      mockAuthGuard.canActivate.mockResolvedValue(true);
      mockGetTariffsService.getAllTariffs.mockResolvedValue(data);

      await expect(getTariffsController.getTariffs(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(data);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockGetTariffsService.getAllTariffs).toHaveBeenCalledWith(parseInt(mockRequest.query.userId));
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

      mockGetTariffsService.getAllTariffs.mockRejectedValue(httpException);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(getTariffsController.getTariffs(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetTariffsService.getAllTariffs).toHaveBeenCalledWith(parseInt(mockRequest.query.userId));
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

      mockGetTariffsService.getAllTariffs.mockRejectedValue(error);
      mockAuthGuard.canActivate.mockResolvedValue(true);

      await expect(getTariffsController.getTariffs(
        mockRequest as any,
        mockResponse as any,
      )).resolves.toEqual(errorResponse);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockGetTariffsService.getAllTariffs).toHaveBeenCalledWith(parseInt(mockRequest.query.userId));
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});
