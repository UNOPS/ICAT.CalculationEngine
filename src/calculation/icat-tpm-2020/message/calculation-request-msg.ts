
import { BaseMileStoneDto } from "../dto/baseMileStone.dto";
import { BaselineDto } from "../dto/baseline.dto";
import { SelectApproch } from "../dto/selectApproch.dto";
import { ProjectDto } from "../dto/project.dto";

export class IcatTpm2020request{

   projectType: SelectApproch ;

   baseline: BaselineDto;
   project:ProjectDto;

   baseMileStone :BaseMileStoneDto;

   // mileStone: MileStoneParameterDto[];
}