import { BaseLineDto } from "../dto/baseline.dto";
import { LeakageDto } from "../dto/leakage.dto";
import { ProjectDto } from "../dto/project.dto";

export class CdmAm0031ReqMsg {
    baseline:BaseLineDto[];
    projectEmission: ProjectDto[];
    leakage: LeakageDto
}