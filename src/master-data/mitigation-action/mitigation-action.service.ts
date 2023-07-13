import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MitigationActionType } from './entity/mitigation-action.entity';

@Injectable()
export class MitigationActionService extends TypeOrmCrudService<MitigationActionType> {
  constructor(@InjectRepository(MitigationActionType) repo) {
    super(repo);
  }

  public async crete(req: MitigationActionType) {
    this.repo.save(req)
  }

  public async getdatails() {
    return this.repo.find();
  }
}
