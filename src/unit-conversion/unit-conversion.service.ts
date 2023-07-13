import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UnitConversion } from './enitity/unit-conversion.entity';

@Injectable()
export class UnitConversionService extends TypeOrmCrudService<UnitConversion> {

    constructor(
        @InjectRepository(UnitConversion) repo) { 
        super(repo);
    }
    
    public async getdatails(){
        return this.repo.find();
    }
    public async crete(req:UnitConversion){
        this.repo.save(req)
    }
}
