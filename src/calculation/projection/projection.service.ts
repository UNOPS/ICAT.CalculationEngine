import { Injectable } from '@nestjs/common';
import { ProjectionReqMsg } from './message/projection-req-msg';
import { ProjectionResMsg } from './message/projection-res-msg';

@Injectable()
export class ProjectionService {
  public projection(req: ProjectionReqMsg) {
    const projection = [];

    for (const num in req.mileStoneParameter) {
      const projectionResponse = new ProjectionResMsg();

      const baselineEmission = this.projectionCalculation(
        req.baseYearParameter.baseYearMileStone,
        req.mileStoneParameter[num].mileStoneValue,
        req.baseYearParameter.baselineEmission,
      );

      const projectEmission = this.projectionCalculation(
        req.baseYearParameter.baseYearMileStone,
        req.mileStoneParameter[num].mileStoneValue,
        req.baseYearParameter.projectEmission,
      );

      const leakegeEmission = this.projectionCalculation(
        req.baseYearParameter.baseYearMileStone,
        req.mileStoneParameter[num].mileStoneValue,
        req.baseYearParameter.leakegeEmission,
      );

      projectionResponse.year = req.mileStoneParameter[num].year;
      projectionResponse.baselineEmission = Math.round(baselineEmission);
      projectionResponse.projectEmission = Math.round(projectEmission);
      projectionResponse.leakegeEmission = Math.round(leakegeEmission);
      projectionResponse.emissionReduction = Math.round(
        baselineEmission - projectEmission,
      );

      projection.push(projectionResponse);
    }
    return projection;
  }

  public projectionCalculation(
    currentMileStone: number,
    newMileStone: number,
    currentGHG: number,
  ) {
    return (newMileStone * currentGHG) / currentMileStone;
  }
}
