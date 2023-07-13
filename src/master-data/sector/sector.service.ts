import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Sector } from './entity/sector.entity';

@Injectable()
export class SectorService extends TypeOrmCrudService<Sector> {
  constructor(@InjectRepository(Sector) repo) {
    super(repo);
  }

  public async crete(req: Sector) {
    this.repo.save(req)
  }

  public async getdatails() {
    return this.repo.find();
  }
    
  }





