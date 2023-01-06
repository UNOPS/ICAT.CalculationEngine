import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'consumerPrice'})
export class ConsumerPriceEntity  extends BaseTrackingEntity{
    
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
