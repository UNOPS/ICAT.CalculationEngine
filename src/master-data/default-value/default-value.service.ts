import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DefaultValue } from './defaultValue.entity';

@Injectable()
export class DefaultValueService extends TypeOrmCrudService<DefaultValue> {
    constructor(@InjectRepository(DefaultValue) repo,
        ){super(repo);
    }

    public async crete(req: DefaultValue) {
        this.repo.save(req)
      }
    
      public async getdatails() {
        return this.repo.find();
      }
}