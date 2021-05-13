import { HealthCheckController } from "./health-check.controller";
import { HttpMethodName } from "../enum";
import { genRandomType } from "@test/random";


describe('`HealthCheckController`', () => {
  let healthCheckController: HealthCheckController;

  const mockHealthCheckService = {
    healthCheck: jest.fn(),
  } as any;
  const mockRequest = {
    url: '/someUrl',
    method: HttpMethodName.GET,
  } as any;
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any;

  beforeEach(() => {
    healthCheckController = new HealthCheckController(mockHealthCheckService);
  });

  it('should be instance of `HealthCheckController`', () => {
    expect(healthCheckController).toBeInstanceOf(HealthCheckController);
    expect(new HealthCheckController()).toBeInstanceOf(HealthCheckController);
  });

  describe('`handle`', () => {
    it('should call health check and return response', async () => {
      const data = {
        field1: genRandomType(),
        field2: genRandomType(),
      };
      const healthCheckSpy = jest.spyOn(mockHealthCheckService, 'healthCheck').mockReturnValue(data);
      const res = await healthCheckController.handle(mockRequest, mockResponse);

      expect(healthCheckSpy).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(data);
      expect(res).toEqual(mockResponse);
    });
  });
});
