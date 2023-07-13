import { Module } from '@nestjs/common';
import { UnfcccAmsIiiBcController } from './unfccc-ams-iii-bc.controller';
import { UnfcccAmsIiiBcService } from './unfccc-ams-iii-bc.service';

@Module({
  controllers: [UnfcccAmsIiiBcController],
  providers: [UnfcccAmsIiiBcService]
})
export class UnfcccAmsIiiBcModule { }
