import { baselineDto } from "../dto/baseline.dto"
import { leakageDto } from "../dto/leakage.dto"
import { projecteDto } from "../dto/project.dto"

export class UnfcccAm0016V5ReqMsg{

baseline:baselineDto[]
project:projecteDto[];
leakage:leakageDto[]
}