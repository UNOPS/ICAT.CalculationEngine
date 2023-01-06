import { VehicleDto } from "src/calculation/unfccc-ams-iii-s-v-4/dto/vehicle.dto";
import { LeakageDto } from "./leakage.dto";

export class ProjectDto {
    vehicle:VehicleDto[];
    leakege:LeakageDto;
    p:number;
}