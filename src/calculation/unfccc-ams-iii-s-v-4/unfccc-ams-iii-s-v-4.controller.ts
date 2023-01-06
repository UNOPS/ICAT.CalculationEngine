import { Body, Controller, Post } from '@nestjs/common';
import { UnfcccAmsIIISV4Service } from './unfccc-ams-iii-s-v-4.service';
import { UnfcccAmsIIISV4RequestMsg } from './message/unfccc-ams-iii-s-v-4-req-msg';
import { UnfcccAmsIIISV4ResponseMsg } from './message/unfccc-ams-iii-s-v-4-res-msg';
import { ResponseDto } from '../icat-tpm-2020/dto/response.dto';

@Controller('cdm-ams-iii-s')
export class UnfcccAmsIIISV4Controller {

    constructor(public service: UnfcccAmsIIISV4Service) {

    }

    @Post('cdm-ams-iii-s')
    public ghgEmission(@Body() req: UnfcccAmsIIISV4RequestMsg): UnfcccAmsIIISV4ResponseMsg {

        let response: UnfcccAmsIIISV4ResponseMsg;
        var responseArray = new Array();

        for (let arr in req.baseline) {

            let projectEmission = 0;
            let baseLineEmission = 0;

            var baseResponse = new ResponseDto();

            for (let num in req.baseline[arr].vehicle) {
                let baseline = this.service.baselineEmission(req.baseline[arr].vehicle[num], req.project[arr].vehicle[num]);
                baseLineEmission += baseline;
            }

            for (let num in req.project[arr].vehicle) {
                let emission = this.service.projectEmission(req.project[arr].vehicle[num]);
                projectEmission += emission;
            }

            baseResponse.year = req.baseline[arr].year;
            baseResponse.projectEmission = parseFloat(Number(projectEmission).toFixed(2));
            baseResponse.baseLineEmission = parseFloat(Number(baseLineEmission).toFixed(2));
            baseResponse.emissionReduction = parseFloat(Number(baseLineEmission - projectEmission).toFixed(2));

            responseArray.push(baseResponse);
        }


        response.response = responseArray;
        response.metaData = req;
        return response;
    }
}
