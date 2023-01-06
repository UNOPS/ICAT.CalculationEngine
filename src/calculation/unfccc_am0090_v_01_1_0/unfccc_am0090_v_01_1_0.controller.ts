import { Body, Controller, Post } from '@nestjs/common';
import { UnfcccAm0090V0110Service as UnfcccAm0090V0110Service } from './unfccc_am0090_v_01_1_0.service';
import { UnfcccAm0090V0110ReqMsg } from './message/unfccc_am0090_v_01_1_0_req_msg';
import { UnfcccAm0090V0110ResMsg } from './message/unfccc_am0090_v_01_1_0_res_msg';
import { MacUnfcccAm0090V0110ReqMsg } from './message/mac_unfccc_am0090_v_01_1_0_req_msg';

@Controller('icatm1')
export class UnfcccAm0090V0110Controller {

    constructor(public service: UnfcccAm0090V0110Service) { }

    @Post('/icatm1')
    public ICATM1(@Body() req: UnfcccAm0090V0110ReqMsg) {

        console.log("reqpull===",req)

        var responseArray = new Array();

        for (let num in req.baseline) {

            var response = new UnfcccAm0090V0110ResMsg();

            response.year = req.baseline[num].year;

            response.baselineEmission = this.service.baselineEmission(req.baseline[num])

            response.projectEmission = this.service.projectEmission(req.project[num])

            response.emissionReduction = response.baselineEmission - response.projectEmission;


            responseArray.push(response);
        }
        return responseArray;
    }


    @Post('/mac_unfccc_am0090_v_01_1_0')
    private macCalculation(@Body() req: MacUnfcccAm0090V0110ReqMsg) {

        let projecttotalInvestment = 0;

        let projectLevInvestment = this.service.pmtCalculation(req.generalInput.discountRate, req.fuelProject.projectLife, projecttotalInvestment);

        let projectAnualOAndM = this.service.annual_OM(req.fuelProject.investmentTrain, req.fuelProject.annualOAndM);


        let projectAnnuaFuelCost = this.service.annualFuelCost(req.generalInput.dailyActivity, req.fuelProject.specificDieselConsumption,
            req.fuelProject.oneUsGalon, req.fuelProject.OneMile, req.fuelProject.dieselPrice);

        let projectTotalAnualCost = this.service.totalAnualCost(projectLevInvestment, projectAnualOAndM, projectAnnuaFuelCost);

        let referencetotalInvestment = 0;

        let referenceLevInvestment = this.service.pmtCalculation(req.fuelReference.discountRate, req.fuelReference.projectLife, referencetotalInvestment);

        let referenceAnualOAndM = this.service.reference_annual_OM(req.fuelReference.annualOAndM, req.fuelReference.investmentInOneTruck, req.generalInput.dailyActivity, req.fuelReference.occupancy);

        let referenceAnnuaFuelCost = this.service.reference_annualFuelCost(req.generalInput.dailyActivity, req.fuelReference.dieselConsumption, req.fuelReference.dieselPrice);

        let referenceTotalAnualCost = this.service.totalAnualCost(referenceLevInvestment, referenceAnualOAndM, referenceAnnuaFuelCost);

        let increase_totalInvestment = projecttotalInvestment - referencetotalInvestment;
        let increase_levInvestment = projectLevInvestment - referenceLevInvestment;
        let increase_annualOAndM = projectAnualOAndM - referenceAnualOAndM;
        let increase_annualFuelCost = projectAnnuaFuelCost - referenceAnnuaFuelCost;
        let increse_totalAnnualCost = projectTotalAnualCost - referenceTotalAnualCost;

        let mac = increse_totalAnnualCost / 67;

        return mac;


    }
}
