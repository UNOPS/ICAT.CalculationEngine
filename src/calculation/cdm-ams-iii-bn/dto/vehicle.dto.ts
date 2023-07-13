import { FuelDto } from "./fuel.dto";

export class VehicleDto {
    type: string;
    fuel: FuelDto[];

    //Total amount of fossil fuel type i consumed by the buses driving in the baseline/project route
    // fuelConsumption: number;
    // // Total electricity consumed by electric buses driving on the baseline/project route
    // elecConsumption: number;
}
