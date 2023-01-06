import { ElectricityDto } from "./electricity.dto";
import { FuelDto } from "./fuel.dto";

export class VehicleDto{
    
    vehicleType:string;

    or:number;
    
    n:number;
    fuel: FuelDto;
    electricity: ElectricityDto;

    fuelEconomy:number;

    price: number;

    prevuiousTax: number;

    newTax: number;

    percentageReduction:number;

    
    vahicleSale: number
    distance: number;
}