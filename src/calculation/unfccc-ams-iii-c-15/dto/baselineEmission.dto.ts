import { VehicleDto } from "src/calculation/unfccc-ams-iii-s-v-4/dto/vehicle.dto";


export class BaseLineEmissionDto{

    year:number;
    
    vehicle:VehicleDto[];
    distance:number;
}