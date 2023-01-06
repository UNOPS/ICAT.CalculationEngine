import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'pppConversionFactor'})
export class PppConversionFactor extends BaseTrackingEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    countryCode: string;
    // primaryKey:true;

    @Column()
    countryName:string;

    @Column()
    value:number;

    @Column()
    year:number;

}
