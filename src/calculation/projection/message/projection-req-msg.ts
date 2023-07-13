import { BaseYearParameterDto } from "../dto/base-year-parameter.dto";
import { MileStoneParameterDto } from "../dto/mile-stone-parameter.dto";

export class ProjectionReqMsg {


    projectionIndicator: string;

    baseYearParameter: BaseYearParameterDto;

    mileStoneParameter: MileStoneParameterDto[];

}