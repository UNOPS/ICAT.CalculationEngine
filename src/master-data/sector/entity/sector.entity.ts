import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Entity,
  ManyToMany,
  JoinTable,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

//import { ClimateChangeDataCategory } from '../cimate-change-data-category/climate.change.data.category.entity';

@Entity({ name: 'sector' })
export class Sector extends BaseTrackingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ length: 300, default: null })
  description: string;

  @Column({ default: 1 })
  sortOrder: number;

  // @Column()
  // emissionSummary: string;

  // @Column()
  // ndcDocuments: string;

  @Column({ default: null })
  uniqueIdentification: string;


}