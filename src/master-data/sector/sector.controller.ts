import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Sector } from './entity/sector.entity';
import { SectorService } from './sector.service';

@Crud({
  model: {
    type: Sector,
  },
  query: {
    join: {
      climateChangeDataCategory: {
        eager: true,
      },
      country: {
        eager: true,
      },
      subSector: {
        eager: true,
      },
    },
  },
})
@Controller('sector')
export class SectorController implements CrudController<Sector> {
  constructor(public service: SectorService) {}

  get base(): CrudController<Sector> {
    return this;
  }

  @Get('')
  public async getall() {
    const details = this.service.getdatails();
    return details;
  }

  @Post()
  public async createUnit(@Body() req: Sector) {
    console.log(req);
    this.service.crete(req);
  }

  @Override()
  async getMany(
    @ParsedRequest() req: CrudRequest,
  ): Promise<GetManyDefaultResponse<Sector> | Sector[]> {
    try {
      const res = await this.base.getManyBase(req);
      // console.log('*********************************************');
      // console.log(res);
      // console.log('*********************************************');
      // console.log(req);
      return res;
    } catch (error) {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      console.log(error);
    }
  }
}
