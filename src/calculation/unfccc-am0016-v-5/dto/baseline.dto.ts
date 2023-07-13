import { electrictyDto } from "./electricity.dto";
import { fuelDto } from "./fuel.dto";
import { vehicleDto } from "./vehicle.dto";

export class baselineDto {

   // boption: number; //baseLine Option
    year:number
    py: number;//for BE option 1
   // pdy:number;//for BE option 2

  //  y:number;//Crediting year

   // efco2x:number;
    vehicle: vehicleDto[];
   
  

}