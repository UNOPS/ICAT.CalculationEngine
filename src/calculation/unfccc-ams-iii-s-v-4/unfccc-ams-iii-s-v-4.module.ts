import { Module } from '@nestjs/common';
import { UnfcccAmsIIISV4Controller } from './unfccc-ams-iii-s-v-4.controller';
import { UnfcccAmsIIISV4Service } from './unfccc-ams-iii-s-v-4.service';

@Module({
  controllers: [UnfcccAmsIIISV4Controller],
  providers:[UnfcccAmsIIISV4Service],
  exports:[UnfcccAmsIIISV4Service]
})
export class UnfcccAmsIIISV4Module {}
