import { BaselineDto } from "../dto/baseline.dto";
import { ProjectDto } from "../dto/project.dto";

export class CdmAmsIIIATReqMsg {
    baseline: BaselineDto[];
    project: ProjectDto[];
}