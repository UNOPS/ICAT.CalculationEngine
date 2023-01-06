import { BaselineDto } from "../dto/baseline.dto";
import { LeakageDto } from "../dto/leakage.dto";
import { ProjectDto } from "../dto/project.dto";

export class CdmAcm0017ReqMsg {
    baseline: BaselineDto[];
    project: ProjectDto[];
    leakage: LeakageDto[];
}