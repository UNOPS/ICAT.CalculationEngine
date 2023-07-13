import { Body, Controller, Post } from '@nestjs/common';
import { MacUnfcccAmsIIIBcReqMsg } from './message/mac-unfccc-ams-iii-bc-req-msg';
import { UnfccAmsIIIBcReqMsg } from './message/unfccc-ams-iii-bc-req-msg';
import { UnfcccAmsIIIBcResMsg } from './message/unfccc-ams-iii-bc-res-msg';
import { UnfcccAmsIiiBcService } from './unfccc-ams-iii-bc.service';

@Controller('unfccc-ams-iii-bc')
export class UnfcccAmsIiiBcController {

    constructor(public service: UnfcccAmsIiiBcService) { }



    @Post('/icatm1')
    private ICATM1(@Body() req: UnfccAmsIIIBcReqMsg) {

        var response = new UnfcccAmsIIIBcResMsg();
        for (let num in req.baseline) {

        var responseArray = new Array();

        let baselineEmissionHeavy = this.service.baselineEmissionHeavy(req.baseline[num]);

        let baselineEmissionOther = this.service.baselineEmissionOther(req.baseline[num]);

        let projectEmissionHeay = this.service.projectEmissionHeavy(req.project[num]);

        let projectEmissionOther = this.service.projectEmissionOther(req.project[num]);

        response.year = req.baseline[num].year;

        response.baselineEmission = baselineEmissionHeavy + baselineEmissionOther;

        response.projectEmission =  projectEmissionHeay + projectEmissionOther;

        response.leakegeEmission = null;

        response.emissionReduction = response.baselineEmission -  response.projectEmission;

        responseArray.push(response);
        
        }

        return responseArray;

    }

    //Mac Calculations
    @Post('/mac')
    private macCalculation(@Body() req: MacUnfcccAmsIIIBcReqMsg) {

        //project (reduction)
        let projecttotalInvestment =  this.service.projecttotalInvestment(req.generalInput);

        let projectLevInvestment = this.service.pmtCalculation(req.generalInput.discountRate, req.fuelProject.projectLife, projecttotalInvestment);

        let projectAnualOAndM = this.service.annual_OM(req.generalInput);

        let projectAnnualFuelCost = this.service.annualFuelCost(req.fuelProject);
        

        //reference
        let referencetotalInvestment =0;

        let referenceLevInvestment = 0;
        
        let referenceAnualOAndM = 0;

        let referenceAnnualFuelCost = this.service.referenceAnnualFuelCost(req.fuelReference);


        let increaseTotalInvestment= projecttotalInvestment - referencetotalInvestment ;
        let increaseLevInvestment= projectLevInvestment - referenceLevInvestment ;
        let increaseAnualOAndM = projectAnualOAndM - referenceAnualOAndM  ;
        let increaseAnnualFuelCost = projectAnnualFuelCost - referenceAnnualFuelCost;
        



        


    }

}
