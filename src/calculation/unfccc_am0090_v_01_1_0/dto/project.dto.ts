import { fuelDto } from "./fuel.dto";
import { sourceDto } from "./source.dto";
import { vehicleDto } from "./vehicle.dto";

export class projectDto{

  year:number;

  vehicle:vehicleDto[]

  ty:number; //Amount of cargo transported by the project transportation mode

  trty:number; //Amount of cargo transported by the project transportation mode in the return trips

 

}