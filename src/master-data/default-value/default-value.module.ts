import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultValueController } from './default-value.controller';
import { DefaultValueService } from './default-value.service';
import { DefaultValue } from './defaultValue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DefaultValue])],
  controllers: [DefaultValueController],
  providers: [DefaultValueService,],
  exports: [DefaultValueService],
})
export class DefaultValueModule {}
