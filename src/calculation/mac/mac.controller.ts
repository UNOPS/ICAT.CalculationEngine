import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { MacCalculationReqDTO } from "./dto/mac-calculation-req.dto";
import { MacCalculationResDTO } from "./dto/mac-calculation-res.dto";
import { MacService } from './mac.service';

@Controller('mac')
export class MacController {

    constructor(public service: MacService,
    ) {
    }


    @Post('/')
    @UseGuards(LocalAuthGuard)
    public MacCalculation(@Body() req: MacCalculationReqDTO): MacCalculationResDTO {
        
        // base=reference
        var response = new MacCalculationResDTO();

        const reduction_lev_invest = this.service.pmtCalculation(req.DiscountRate, req.project.psProjectLife, req.project.psTotalInvestment);
        const reference_lev_invest = this.service.pmtCalculation(req.DiscountRate, req.baseline.bsProjectLife, req.baseline.bsTotalInvestment);

        const reduction_cost = this.service.totolCost(reduction_lev_invest, req.project.psAnnualOM, req.project.psAnnualFuel, req.project.psOtherAnnualCost);
        const reference_cost = this.service.totolCost(reference_lev_invest, req.baseline.bsAnnualOM, req.baseline.bsAnnualFuel, req.baseline.bsOtherAnnualCost);

        const total_cost = reduction_cost - reference_cost;
        const mac = total_cost / req.reduction;

        response.year = req.year;
        response.baseLineAnnualCost = parseFloat(Number(reference_cost).toFixed(2)); 
        response.projecrAnnualCost = parseFloat(Number(reduction_cost).toFixed(2));
        response.totalAnnualCost = Math.round(total_cost);
        response.mac = Math.round(mac);


        return response;
    }
}
