import { ProjectEmissionTypeEnum } from "src/calculation/enum/project-emisson-type.enum";
import { VehicleDto } from "src/calculation/unfccc-ams-iii-s-v-4/dto/vehicle.dto";

export class BaseLineDto{
    year: number;
    baselineEmissonType: ProjectEmissionTypeEnum;
    vehicle:VehicleDto[];

}