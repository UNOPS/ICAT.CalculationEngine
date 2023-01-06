import { Module } from '@nestjs/common';
import { CdmAmsIIIATService } from './cdm-ams-iii-at.service';

@Module({
  providers: [CdmAmsIIIATService]
})
export class CdmAcm0017Module {}
