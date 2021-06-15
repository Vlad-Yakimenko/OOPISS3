import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { generateTestData } from '@test/random';
import { HealthCheckController } from './http/health-check.controller';
import { HealthCheckService } from './http/health-check.service';
import { ORMConfig } from './ormconfig';

import { LoggerModule } from './log';
import { HelperModule } from './shared/helper';
import { AuthModule } from './http/module/auth';
import { CallingModule } from './http/module/calling';
import { TariffModule } from './http/module/tariff';
import { UserModule } from './http/module/user';
import { AuthGuard } from './http/guard';
import { 
  BillRepository, CallingRepository, 
  TariffRepository, UserRepository 
} from './db/repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ORMConfig,
    }),
    TypeOrmModule.forFeature([
      UserRepository, CallingRepository, 
      BillRepository, TariffRepository,
    ]),
    LoggerModule,
    HelperModule,
    AuthModule,
    CallingModule,
    TariffModule,
    UserModule,
  ],
  controllers: [
    HealthCheckController,
  ],
  providers: [
    HealthCheckService,
    AuthGuard,
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
    generateTestData(connection);
  }
}
