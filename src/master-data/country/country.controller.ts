import { Body, Controller, Get, Post } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { CountryService } from './country.service';
import { Country } from './entity/country.entity';

@Crud({
    model: {
      type: Country,
    },
    query: {
      join:{
        sector: {
          eager: true,
        },
      },
    },
  })

@Controller('country')
export class CountryController implements CrudController<Country>{
    constructor(public service: CountryService){}

    @Get("")
    public async getall(){
        let details = this.service.getdatails()
        return details
    }
  
    @Post()
    public async createUnit(@Body() req:Country){
         console.log(req);
        this.service.crete(req)
    }

}
