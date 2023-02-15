import { Body, Controller, Get, Post } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { MitigationActionType } from './entity/mitigation-action.entity';
import { MitigationActionService } from './mitigation-action.service';

@Crud({
  model: {
    type: MitigationActionType,
  },
})
@Controller('mitigation-action')
export class MitigationActionController
  implements CrudController<MitigationActionType>
{
  constructor(public service: MitigationActionService) {}

  @Get('')
  public async getall() {
    const details = this.service.getdatails();
    return details;
  }

  @Post()
  public async createUnit(@Body() req: MitigationActionType) {
    this.service.crete(req);
  }
}
