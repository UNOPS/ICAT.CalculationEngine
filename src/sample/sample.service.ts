import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Sample } from './entity/sample.entity';

@Injectable()
export class SampleService extends TypeOrmCrudService<Sample>  {
 
  

    constructor(@InjectRepository(Sample) repo) {
        super(repo);
    }

    async hello(name: string): Promise<string> {
        return 'Hello ' + name;
    }

  async  hellosave(createCatDto: Sample) {
        return this.repo.save(createCatDto);
    }

   async findAll(): Promise<Sample[]> {
        return this.repo.find();
      }

}
