import { ProjectDto } from "src/calculation/jica-railway-freight/dto/project.dto";
import { BaseLineDto } from "../dto/baseline.dto";

export class JicaRailwayPassengerReqMsg {


    baselineEmission: BaseLineDto[];

    projectEmission: ProjectDto;

}