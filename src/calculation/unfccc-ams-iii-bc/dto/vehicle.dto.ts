import { VehicleTypeEnum } from "src/calculation/enum/vehicle-type.enum";
import { fuelDto } from "./fuel.dto";
//import { fuelDto } from "./fuel.dto";

export class vehicleDto {

    fuel: fuelDto;

    name:string;
    type: VehicleTypeEnum;
    //isheavy:number;

    beftkmixy:number;//Baseline emission factor per tkm
   // befkmixy:number;

    sfcblixy: number; //Specific baseline OR project fuel consumption
    awblixy: number; // Average GVW baseline OR project

    avgweightbyvehicle:number;
    totaldistancetravel:number;

    altkmixy: number;
   // alkmixy: number; //Activity level of project in km

}