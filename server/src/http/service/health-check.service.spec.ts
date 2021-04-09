import { HealthCheckService } from "./health-check.service";

describe('`HealthCheckService`', () => {
  let healthCheckService: HealthCheckService;

  beforeEach(() => {
    healthCheckService = new HealthCheckService();
  });

  it('should be instance of `HealthCheckService`', () => {
    expect(healthCheckService).toBeInstanceOf(HealthCheckService);
  });

  it('`healthCheck`', () => {
    expect(healthCheckService.healthCheck()).toMatchObject({
      name: expect.any(String),
      time: expect.any(String),
    });
  });
});