import { HealthCheckController } from "./health-check.controller";
import { genRandomType } from "@test/random";

describe('`HealthCheckController`', () => {
  let healthCheckController: HealthCheckController;

  const mockHealthCheckService = {
    healthCheck: jest.fn(),
  } as any;

  beforeEach(() => {
    healthCheckController = new HealthCheckController(mockHealthCheckService);
  });

  it('should be instance of `HealthCheckController`', () => {
    expect(healthCheckController).toBeInstanceOf(HealthCheckController);
  });

  describe('`healthCheck`', () => {
    it('should call health check and return response', async () => {
      const data = {
        field1: genRandomType(),
        field2: genRandomType(),
      };
      const healthCheckSpy = jest.spyOn(mockHealthCheckService, 'healthCheck').mockReturnValue(data);
      const res = await healthCheckController.healthCheck();

      expect(healthCheckSpy).toHaveBeenCalled();
      expect(res).toEqual(data);
    });
  });
});
