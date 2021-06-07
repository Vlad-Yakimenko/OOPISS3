import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { HealthCheckController } from './http/health-check.controller';
import { HealthCheckService } from './http/health-check.service';
import { LoggerModule } from './log';
import { ORMConfig } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ORMConfig,
    }),
    LoggerModule,
  ],
  controllers: [
    HealthCheckController,
  ],
  providers: [
    HealthCheckService,
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
