import { ProjectEmissionTypeEnum } from "src/calculation/enum/project-emisson-type.enum";
import { VehicleDto } from "./vehicle.dto";

export class BaseLineEmissionDto{

    year:number;
    baselineEmissonType: ProjectEmissionTypeEnum;
    vehicle:VehicleDto[];
    distance:number ;
    tdl:number;
}