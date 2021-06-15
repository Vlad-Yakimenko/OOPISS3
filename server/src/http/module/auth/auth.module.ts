import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HelperModule } from '@app/shared/helper';
import { UserRepository } from '@app/db/repository';
import { TokenService } from './token.service';
import { SignInService } from './sign-in.service';
import { SignUpService } from './sign-up.service';
import { SignInController } from './sign-in.controller';
import { SignUpController } from './sign-up.controller';

@Module({
  imports: [
    HelperModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [
    SignInController,
    SignUpController,
  ],
  providers: [
    TokenService,
    SignInService,
    SignUpService,
  ],
  exports: [
    TokenService,
  ]
})
export class AuthModule { }
