import { Module } from '@nestjs/common';
import { UnfcccAm0090V0110Service } from './unfccc_am0090_v_01_1_0.service';
import { UnfcccAm0090V0110Controller } from './unfccc_am0090_v_01_1_0.controller';

@Module({
  providers: [UnfcccAm0090V0110Service],

  controllers: [UnfcccAm0090V0110Controller]
})
export class UnfcccAm0090V0110Module {}
