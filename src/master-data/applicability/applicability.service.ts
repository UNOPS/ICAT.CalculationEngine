import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ApplicabilityEntity } from './entity/applicability.entity';

@Injectable()
export class ApplicabilityService extends TypeOrmCrudService<ApplicabilityEntity> {
  constructor(@InjectRepository(ApplicabilityEntity) repo) {
    super(repo);
  }

  public async crete(req: ApplicabilityEntity) {
    this.repo.save(req)
  }

  public async getdatails() {
    return this.repo.find();
  }
}
