import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { 
  CallingRepository, TariffRepository, 
  UserRepository, 
} from '@app/db/repository';
import { AddCallingsService } from './add-callings.service';
import { GetCallingsService } from './get-callings.service';
import { AddCallingsController } from './add-callings.controller';
import { GetCallingsController } from './get-callings.controller';
import { AuthGuard } from '@app/http/guard';
import { AuthModule } from '../auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([CallingRepository]),
    TypeOrmModule.forFeature([TariffRepository]),
    AuthModule,
  ],
  controllers: [
    AddCallingsController,
    GetCallingsController,
  ],
  providers: [
    AddCallingsService,
    GetCallingsService,
    AuthGuard,
  ],
  exports: [

  ]
})
export class CallingModule { }