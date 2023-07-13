import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MitigationActionType } from './entity/mitigation-action.entity';
import { MitigationActionController } from './mitigation-action.controller';
import { MitigationActionService } from './mitigation-action.service';

@Module({
  imports: [TypeOrmModule.forFeature([MitigationActionType])],
  providers: [MitigationActionService],
  controllers: [MitigationActionController],
  exports: [MitigationActionService],
})
export class MitigationActionModule {}
