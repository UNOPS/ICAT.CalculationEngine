import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
    Column,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'unit_conversion' })
export class UnitConversion extends BaseTrackingEntity {
    constructor() {
        super();
        this.createdBy = '';
        this.editedBy = '';
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    fromUnit: string;

    @Column({ nullable: false })
    toUnit: string;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: false })
    conversionFactor: number;

    @PrimaryGeneratedColumn("uuid")
    unitIdentification: number;
}