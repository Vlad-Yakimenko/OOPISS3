import { Module } from '@nestjs/common';
import { HealthCheckController } from './http/health-check.controller';
import { HealthCheckService } from './http/health-check.service';
import { LoggerModule } from './log';

@Module({
  imports: [
    LoggerModule,
  ],
  controllers: [
    HealthCheckController,
  ],
  providers: [
    HealthCheckService,
  ],
})
export class AppModule { }
