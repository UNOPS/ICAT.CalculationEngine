import { Body, Controller, Get, Post } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { UnitConversion } from './enitity/unit-conversion.entity';
import { UnitConversionService } from './unit-conversion.service';

@Crud({
  model: {
    type: UnitConversion,
  },
})
@Controller('unit-conversion')
export class UnitConversionController {
  constructor(public service: UnitConversionService) {}

  @Get('')
  public async getall() {
    const details = this.service.getdatails();
    return details;
  }

  @Post()
  public async createUnit(@Body() req: UnitConversion) {
    console.log(req);
    this.service.crete(req);
  }
}
