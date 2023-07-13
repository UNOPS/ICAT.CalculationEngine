import { Body, Controller, Get, Post } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ApplicabilityService } from './applicability.service';
import { ApplicabilityEntity } from './entity/applicability.entity';

@Crud({
  model: {
    type: ApplicabilityEntity,
  },
  query: {},
})
@Controller('applicability')
export class ApplicabilityController
  implements CrudController<ApplicabilityEntity>
{
  constructor(public service: ApplicabilityService) {}

  @Get("")
  public async getall(){
      let details = this.service.getdatails()
      return details
  }

  @Post()
  public async createUnit(@Body() req:ApplicabilityEntity){
       console.log(req);
      this.service.crete(req)
  }

  get base(): CrudController<ApplicabilityEntity> {
    return this;
  }
}
