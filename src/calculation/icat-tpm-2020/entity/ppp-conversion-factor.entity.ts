import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pppConversionFactor' })
export class PppConversionFactor extends BaseTrackingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryCode: string;

  @Column()
  countryName: string;

  @Column()
  value: number;

  @Column()
  year: number;
}
