import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitConversion } from './enitity/unit-conversion.entity';
import { UnitConversionController } from './unit-conversion.controller';
import { UnitConversionService } from './unit-conversion.service';

@Module({
  imports:[TypeOrmModule.forFeature([UnitConversion])],
  controllers: [UnitConversionController],
  providers: [UnitConversionService],
  exports:[UnitConversionService]
})
export class UnitConversionModule {}
