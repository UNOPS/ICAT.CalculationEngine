import { Module } from '@nestjs/common';
import { CdmAmsIiiBnService } from './cdm-ams-iii-bn.service';

@Module({
  providers: [CdmAmsIiiBnService]
})
export class CdmAmsIiiBnModule {}
