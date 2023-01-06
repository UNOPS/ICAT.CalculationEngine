import { Injectable } from '@nestjs/common';
import { ProjectionReqMsg } from './message/projection-req-msg';
import { ProjectionResMsg } from './message/projection-res-msg';

@Injectable()
export class ProjectionService {

    public projection( req: ProjectionReqMsg) {

        var projection = new Array();

        for (let num in req.mileStoneParameter) {
            // if (num === '0') {
            //     let baseProjectionResponse = new ProjectionResMsg();
            //     baseProjectionResponse.year = req.baseYearParameter.year;
            //     baseProjectionResponse.baselineEmission = Math.round(req.baseYearParameter.baselineEmission);
            //     baseProjectionResponse.projectEmission = Math.round(req.baseYearParameter.projectEmission);
            //     baseProjectionResponse.emissionReduction = Math.round(req.baseYearParameter.baselineEmission - req.baseYearParameter.projectEmission);
            //     projection.push(baseProjectionResponse);
            // }
            let projectionResponse = new ProjectionResMsg();

            let baselineEmission = this.projectionCalculation(req.baseYearParameter.baseYearMileStone, req.mileStoneParameter[num].mileStoneValue, req.baseYearParameter.baselineEmission);

            let projectEmission = this.projectionCalculation(req.baseYearParameter.baseYearMileStone, req.mileStoneParameter[num].mileStoneValue, req.baseYearParameter.projectEmission);

            let leakegeEmission = this.projectionCalculation(req.baseYearParameter.baseYearMileStone, req.mileStoneParameter[num].mileStoneValue, req.baseYearParameter.leakegeEmission);

            projectionResponse.year = req.mileStoneParameter[num].year;
            projectionResponse.baselineEmission = Math.round(baselineEmission);
            projectionResponse.projectEmission = Math.round(projectEmission);
            projectionResponse.leakegeEmission = Math.round(leakegeEmission);
            projectionResponse.emissionReduction = Math.round(baselineEmission - projectEmission);

            projection.push(projectionResponse);

        }
        return projection;
    }

    public projectionCalculation(currentMileStone: number, newMileStone: number, currentGHG:number) {
        // console.log(currentGHG)
        return newMileStone * currentGHG / currentMileStone;
    }


}
