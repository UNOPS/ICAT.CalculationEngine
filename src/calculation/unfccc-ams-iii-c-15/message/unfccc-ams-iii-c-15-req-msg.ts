import { BaseLineEmissionDto } from "../dto/baselineEmission.dto";
import { ProjectEmissionDto } from "../dto/projectEmission.dto";

export class UnfcccAmsIIIC15ReqMsg {

    baseline: BaseLineEmissionDto[];
    project: ProjectEmissionDto[];
}
