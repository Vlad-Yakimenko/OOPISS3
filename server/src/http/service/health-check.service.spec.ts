import { HealthCheckService, SERVICE_NAME } from "./health-check.service";

describe('`HealthCheckService`', () => {
  let healthCheckService: HealthCheckService;

  beforeEach(() => {
    healthCheckService = new HealthCheckService();
  });

  it('should be instance of `HealthCheckService`', () => {
    expect(healthCheckService).toBeInstanceOf(HealthCheckService);
  });

  it('`healthCheck`', () => {
    const data = healthCheckService.healthCheck();
    expect(data.name).toEqual(SERVICE_NAME);
    expect(Date.parse(data.time)).not.toEqual(NaN);
  });
});