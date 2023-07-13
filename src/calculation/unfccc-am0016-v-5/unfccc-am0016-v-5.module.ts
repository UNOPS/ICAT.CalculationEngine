import { Module } from '@nestjs/common';
import { UnfcccAm0016V5Controller } from './unfccc-am0016-v-5.controller';
import { UnfcccAm0016V5Service } from './unfccc-am0016-v-5.service';

@Module({
  controllers: [UnfcccAm0016V5Controller],
  providers: [UnfcccAm0016V5Service]
})
export class UnfcccAm0016V5Module {}
