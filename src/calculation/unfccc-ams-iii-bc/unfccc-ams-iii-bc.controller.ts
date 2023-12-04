import { Body, Controller, Post } from '@nestjs/common';
import { UnfccAmsIIIBcReqMsg } from './message/unfccc-ams-iii-bc-req-msg';
import { UnfcccAmsIIIBcResMsg } from './message/unfccc-ams-iii-bc-res-msg';
import { UnfcccAmsIiiBcService } from './unfccc-ams-iii-bc.service';

@Controller('unfccc-ams-iii-bc')
export class UnfcccAmsIiiBcController {
  constructor(public service: UnfcccAmsIiiBcService) {}

  @Post('/icatm1')
  private ICATM1(@Body() req: UnfccAmsIIIBcReqMsg) {
    const response = new UnfcccAmsIIIBcResMsg();
    for (const num in req.baseline) {
      var responseArray = [];

      const baselineEmissionHeavy = this.service.baselineEmissionHeavy(
        req.baseline[num],
      );

      const baselineEmissionOther = this.service.baselineEmissionOther(
        req.baseline[num],
      );

      const projectEmissionHeay = this.service.projectEmissionHeavy(
        req.project[num],
      );

      const projectEmissionOther = this.service.projectEmissionOther(
        req.project[num],
      );

      response.year = req.baseline[num].year;

      response.baselineEmission = baselineEmissionHeavy + baselineEmissionOther;

      response.projectEmission = projectEmissionHeay + projectEmissionOther;

      response.leakegeEmission = null;

      response.emissionReduction =
        response.baselineEmission - response.projectEmission;

      responseArray.push(response);
    }

    return responseArray;
  }
}
