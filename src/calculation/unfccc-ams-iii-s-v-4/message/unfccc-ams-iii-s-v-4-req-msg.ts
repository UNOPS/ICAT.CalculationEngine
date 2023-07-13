
import { BaseLineEmissionDto } from "../dto/baselineEmission.dto";
import { projectEmissionDto } from "../dto/projectEmission.dto";

export class UnfcccAmsIIISV4RequestMsg{
    baseline : BaseLineEmissionDto[];
    project: projectEmissionDto[];
}