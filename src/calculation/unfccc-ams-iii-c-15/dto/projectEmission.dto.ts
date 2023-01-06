import { VehicleDto } from "src/calculation/unfccc-ams-iii-s-v-4/dto/vehicle.dto";


export class ProjectEmissionDto{

    year:number;

    distance: number; // Annual total trip distance  (km)
    tdl:number; //Average technical transmission and distribution losses for providing electricity in the year y
    // btdp:number;
    // passenger:number;
    vehicle:VehicleDto[];
}