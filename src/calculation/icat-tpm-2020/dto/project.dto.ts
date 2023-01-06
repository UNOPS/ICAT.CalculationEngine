import { FuelDto } from "./fuel.dto";
import { SpecialValueDto } from "./specialValue.dto";
import { VehicleDto } from "./vehicle.dto";

export class ProjectDto {

    year:number
    special:SpecialValueDto;

    // fuelUsed: number;
    fuelMixPriceIncrease: number;
    fuelMixPriceElasticity: number;
    vehicle:VehicleDto[];
    beta:number;

    fuel: FuelDto[];
}