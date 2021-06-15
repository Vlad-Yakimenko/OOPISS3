import { Module } from '@nestjs/common';
import { CryptoHelperService } from './crypto-helper.service';

@Module({
  imports: [

  ],
  providers: [
    CryptoHelperService,
  ],
  exports: [
    CryptoHelperService,
  ]
})
export class HelperModule { }