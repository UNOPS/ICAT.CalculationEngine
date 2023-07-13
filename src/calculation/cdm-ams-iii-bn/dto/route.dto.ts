import { VehicleDto } from "./vehicle.dto";

export class RouteDto {
    type: string;
    vehicle: VehicleDto[];

    pk: number; //Total passenger-kilometres transported in the baseline route
    p: number; // Total passenger transported in the project route k (passenger)

    secpkm: number; //Specific energy consumed per passenger-kilometre from the project route k (GJ/pkm), 
    avdk: number; //Average distance travelled by the passengers in the project route k in year y (km) 

}
