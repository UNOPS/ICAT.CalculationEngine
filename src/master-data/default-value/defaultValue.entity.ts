import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DefaultValue extends BaseTrackingEntity {
  /**
   *
   */
  constructor() {
    super();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  parameterName: string;

  @Column({ default: null })
  parentId: number;

  @Column({ default: null })
  unit: string;

  @Column({ default: null })
  administrationLevel: string;

  @Column({ default: null })
  source: string;

  @Column({ default: null })
  year: number;

  @Column({ default: null })
  value: string;

  @PrimaryGeneratedColumn("uuid")
  unitIdentification: number;

  name: string;
  //   public setName() {
  //     this.name = `${this.value} - ${this.unit} - ${this.administrationLevel} - ${this.source}  - ${this.year}`;
  //   }
}