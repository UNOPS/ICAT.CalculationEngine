import { Body, Controller, Post } from '@nestjs/common';
import { ProjectionReqMsg } from './message/projection-req-msg';
import { ProjectionResMsg } from './message/projection-res-msg';
import { ProjectionService } from './projection.service';

@Controller('projection')
export class ProjectionController {
  constructor(public service: ProjectionService) {}

  @Post('')
  public projectionCalculation(@Body() req: ProjectionReqMsg) {
    const projection = [];

    for (const num in req.mileStoneParameter) {
      if (num === '0') {
        const baseProjectionResponse = new ProjectionResMsg();
        baseProjectionResponse.year = req.baseYearParameter.year;
        baseProjectionResponse.baselineEmission = Math.round(
          req.baseYearParameter.baselineEmission,
        );
        baseProjectionResponse.projectEmission = Math.round(
          req.baseYearParameter.projectEmission,
        );
        baseProjectionResponse.emissionReduction = Math.round(
          req.baseYearParameter.baselineEmission -
            req.baseYearParameter.projectEmission,
        );
        projection.push(baseProjectionResponse);
      }
      const projectionResponse = new ProjectionResMsg();

      const baselineEmission = this.service.projectionCalculation(
        req.baseYearParameter.baseYearMileStone,
        req.mileStoneParameter[num].mileStoneValue,
        req.baseYearParameter.baselineEmission,
      );

      const projectEmission = this.service.projectionCalculation(
        req.baseYearParameter.baseYearMileStone,
        req.mileStoneParameter[num].mileStoneValue,
        req.baseYearParameter.projectEmission,
      );

      const leakegeEmission = this.service.projectionCalculation(
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
}
