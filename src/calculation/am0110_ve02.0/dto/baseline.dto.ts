
import { VehicleDto } from "src/calculation/unfccc-ams-iii-s-v-4/dto/vehicle.dto";
import { RouteDto } from "./route";

export class BaseLineDto{
    year: number;
    // ef_pkm: number; // CO2 emission factor per passenger kilometer for transport mode i (t-CO2/passenger-km)
    
    routs:RouteDto[];

}