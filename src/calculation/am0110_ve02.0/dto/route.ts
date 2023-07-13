import { VehicleDto } from "src/calculation/unfccc-ams-iii-s-v-4/dto/vehicle.dto";
// import { FuelDto } from "./fuel.dto";

export class RouteDto{
    name:string;
    distance:number;
    ef_bl:number;
    t_jy:number;
    vehicle:VehicleDto[];


    t_ky:number;
    ad_ky:number;

    fc_pj:number;
    t_k:number;

    L:number;
    W:number;
    M:number;
    
}