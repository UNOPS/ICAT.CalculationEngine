import { VehicleDto } from "./vehicle.dto";
export class BaselineDto {
    
    vehicle: VehicleDto[];

    fuelUsed: number;  // Total fuel used for ground transport in year y (unspecified mix of gasoline, diesel and/or other transport fuels) 
    
    pkm:number;

    beta:number;
 

    

}