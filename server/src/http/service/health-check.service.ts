export const SERVICE_NAME = 'TELEPHONE_EXCHANGE';

export class HealthCheckService {
  constructor() {}

  public healthCheck(): any {
    return {
      name: SERVICE_NAME,
      time: new Date().toString()
    }
  }
}