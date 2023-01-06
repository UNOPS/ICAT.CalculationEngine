import { Module } from '@nestjs/common';
import { CdmAcm0017Service } from './cdm-acm0017.service';
import { CdmAcm0017Controller } from './cdm-acm0017.controller';

@Module({
  controllers: [CdmAcm0017Controller],
  providers: [CdmAcm0017Service]
})
export class CdmAcm0017Module {}
