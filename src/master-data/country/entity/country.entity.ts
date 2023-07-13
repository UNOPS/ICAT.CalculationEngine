
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({name: 'country'})
export class Country extends BaseTrackingEntity{
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  code: string;

  @Column({ default: null })
  code_extended: string;

  @Column({ default: null })
  name: string;

  @Column({ length: 300, default: null })
  description: string;

  @Column({ default: 1 })
  sortOrder: number;

  // @Column()
  // submissions: string; // add as string for document upload 

  // @Column({ default: null })
  // emissionSummary: string;

  // @Column({ default: null })
  // ndcDocuments: string;

  // @Column({ default: null })
  // isSystemUse: boolean;

  @Column({ default: null })
  flagPath: string;

  // @Column({ default: null })
  // registeredDate: Date;

  
  // @Column({ default: null })
  // isMember: boolean;

 // @Column({ default: null })
 // isRegister: boolean;

  // @Column({ default: null })  // enum 
  // countryStatus: number;

  @Column({ default: null })
  region: string;

  @Column({ default: null })
  uniqueIdentification: string;


}
