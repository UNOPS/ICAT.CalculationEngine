import { fuelDto } from "./fuel.dto";
import { vehicleDto } from "./vehicle.dto";

export class baselineDto{

    year:number;

    ad:number;//Distance of the baseline trip route (km) 

    ty:number;//Amount of cargo transported by the project transportation mode in year y (tonne) 

    
    cdefault: number;   // conservative default
    
    frtbl:number; //Factor to account for non-empty return trips in the baseline scenario (fraction)


    vehicle:vehicleDto[];
   // fuel: fuelDto[];  //efbl historic values according to fuel i

    tx:number           //Amount of cargo transported in trucks in year x 

    trtx:number;        //Amount of cargo transported in trucks in the return trips in year x

    rtdx:number;        // Distance of the return trip route in year x 

}