import { HealthCheckService } from "./health-check.service";
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

@Controller()
export class HealthCheckController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get('/health')
  public async healthCheck(): Promise<any> {
    return this.healthCheckService.healthCheck();
  }
}
