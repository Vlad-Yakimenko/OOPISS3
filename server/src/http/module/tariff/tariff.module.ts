import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TariffRepository, UserRepository } from '@app/db/repository';
import { GetTariffsService } from './get-tariffs.service';
import { GetTariffsController } from './get-tariffs.controller';
import { AuthModule } from '../auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([TariffRepository, UserRepository]),
    AuthModule,
  ],
  controllers: [
    GetTariffsController,
  ],
  providers: [
    GetTariffsService,
  ],
  exports: [

  ]
})
export class TariffModule { }