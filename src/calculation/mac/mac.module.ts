import { Module } from '@nestjs/common';
import { MacController } from './mac.controller';
import { MacService } from './mac.service';

@Module({
  controllers: [MacController],
  providers: [MacService]
})
export class MacModule {}
