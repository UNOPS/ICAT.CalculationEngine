import { Body, Controller, Get, Post } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { MitigationActionType } from './entity/mitigation-action.entity';
// import { MitigationActionType } from './mitigation-action.entity';
import { MitigationActionService } from './mitigation-action.service';

@Crud({
  model: {
    type: MitigationActionType,
  },
  // query: {
  //     join: {

  //     },
  // },
})
@Controller('mitigation-action')
export class MitigationActionController
  implements CrudController<MitigationActionType>
{
  constructor(public service: MitigationActionService) {}

  @Get("")
  public async getall(){
      let details = this.service.getdatails()
      return details
  }

  @Post()
  public async createUnit(@Body() req:MitigationActionType){
       console.log(req);
      this.service.crete(req)
  }
}
