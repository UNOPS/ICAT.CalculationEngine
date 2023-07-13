import { Module } from '@nestjs/common';
import { CdmAmsIiiAkService } from './cdm-ams-iii-ak.service';
import { CdmAmsIiiAkController } from './cdm-ams-iii-ak.controller';

@Module({
  controllers: [CdmAmsIiiAkController],
  providers: [CdmAmsIiiAkService]
})
export class CdmAmsIiiAkModule {}
