import { Body, Controller, Post } from '@nestjs/common';
// import { MacUnfcccAmsIIIBcReqMsg } from './message/mac-unfccc-ams-iii-bc-req-msg';
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

  //Mac Calculations
  // @Post('/mac')
  // private macCalculation(@Body() req: MacUnfcccAmsIIIBcReqMsg) {
  //project (reduction)
  // const projecttotalInvestment = this.service.projecttotalInvestment(
  //   req.generalInput,
  // );
  // const projectLevInvestment = this.service.pmtCalculation(
  //   req.generalInput.discountRate,
  //   req.fuelProject.projectLife,
  //   projecttotalInvestment,
  // );
  // const projectAnualOAndM = this.service.annual_OM(req.generalInput);
  // const projectAnnualFuelCost = this.service.annualFuelCost(req.fuelProject);
  // //reference
  // const referencetotalInvestment = 0;
  // const referenceLevInvestment = 0;
  // const referenceAnualOAndM = 0;
  // const referenceAnnualFuelCost = this.service.referenceAnnualFuelCost(
  //   req.fuelReference,
  // );
  // const increaseTotalInvestment =
  //   projecttotalInvestment - referencetotalInvestment;
  // const increaseLevInvestment = projectLevInvestment - referenceLevInvestment;
  // const increaseAnualOAndM = projectAnualOAndM - referenceAnualOAndM;
  // const increaseAnnualFuelCost =
  //   projectAnnualFuelCost - referenceAnnualFuelCost;
  // }
}
