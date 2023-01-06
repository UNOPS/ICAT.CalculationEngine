import { Module } from '@nestjs/common';
import { CdmAm0031Controller } from './cdm-am0031.controller';
import { CDMAM0031Service } from './cdm-am0031.service';

@Module({
  controllers: [CdmAm0031Controller],
  providers: [CDMAM0031Service]
})
export class CdmAm0031AkModule {}