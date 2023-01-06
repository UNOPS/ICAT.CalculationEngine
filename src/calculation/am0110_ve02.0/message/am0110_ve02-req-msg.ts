import { BaseLineDto } from "../dto/baseline.dto";
import { ProjectDto } from "../dto/project.dto";

export class Am0110ReqMsg {
    baseline:BaseLineDto[];
    projectEmission: ProjectDto[];
}