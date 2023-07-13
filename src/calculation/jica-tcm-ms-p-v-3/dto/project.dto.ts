import { ProjectEmissionTypeEnum } from "src/calculation/enum/project-emisson-type.enum";
import { VehicleTypeEnum } from "src/calculation/enum/vehicle-type.enum";
import { FuelDto } from "src/calculation/unfccc-ams-iii-s-v-4/dto/fuel.dto";
// import { FuelDto } from "./fuel.dto";
import { TraficCongestionDto } from "./trafic-congestion.dto";

export class ProjectDto {

    // constructor(public) {
    //     // this.vehicle_type = vehical_type;
    // }
    vehicle_type: VehicleTypeEnum
    year: number;
    projectEmissonType: ProjectEmissionTypeEnum;

    distance: number; // Annual total trip distance  (km)

    passenger: number; // No of passenger transported per year

    btdp: number; // Average trip distance of the passenger of the project activity in year y (km)

    sfc: number;

    fc: FuelDto[];  // Consumption of fuel OR electricity i associated with the operation of the project activity in year y (t/y)    // array 

    traficCon: TraficCongestionDto[];
    ec: number; // : Electricity consumption associated with the operation of the project activity in year y (MWh/y)
    ef: number;

    validation(): boolean {
        if (this.vehicle_type === VehicleTypeEnum.electric_vehicle) {
            return false;
        }

        else if (this.vehicle_type === VehicleTypeEnum.fuel_vehicle && (this.fc === null || this.fc === undefined || this.fc.length === 0)) {
            return false;
        }

        return true;
    }
}