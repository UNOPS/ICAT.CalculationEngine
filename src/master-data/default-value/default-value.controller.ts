import { Body, Controller, Get, Post } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { DefaultValueService } from './default-value.service';
import { DefaultValue } from './defaultValue.entity';

@Crud({
  model: {
    type: DefaultValue,
  },
  query: {},
})
@Controller('default-value')
export class DefaultValueController implements CrudController<DefaultValue> {
  constructor(public service: DefaultValueService) {}

  @Get('')
  public async getall() {
    const details = this.service.getdatails();
    return details;
  }

  @Post()
  public async createUnit(@Body() req: DefaultValue) {
    console.log(req);
    this.service.crete(req);
  }
}
