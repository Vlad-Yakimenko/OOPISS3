import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '@app/db/repository';
import { AddUserTariffsService } from './add-user-tariffs.service';
import { ChangeUserBalanceService } from './change-user-balance.service';
import { ChangeUserStatusService } from './change-user-status.service';
import { GetUsersService } from './get-users.service';

import { AddUserTariffsController } from './add-user-tariffs.controller';
import { ChangeUserBalanceController } from './change-user-balance.controller';
import { GetUsersController } from './get-users.controller';
import { ChangeUserStatusController } from './change-user-status.controller';
import { AuthModule } from '../auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    AuthModule,
  ],
  controllers: [
    AddUserTariffsController,
    ChangeUserBalanceController,
    ChangeUserStatusController,
    GetUsersController,
  ],
  providers: [
    AddUserTariffsService,
    ChangeUserBalanceService,
    ChangeUserStatusService,
    GetUsersService,
  ],
  exports: [

  ]
})
export class UserModule { }