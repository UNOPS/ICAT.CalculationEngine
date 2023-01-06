import { BaselineDTO, ProjectDTO } from "./request.dto";

export class MacCalculationReqDTO {

    year:number;

    DiscountRate: number;

    reduction: number;

    project: ProjectDTO;

    baseline: BaselineDTO;

}