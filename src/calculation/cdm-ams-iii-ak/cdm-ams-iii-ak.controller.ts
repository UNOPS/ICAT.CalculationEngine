import { Body, Controller, Post } from '@nestjs/common';
import { CdmAmsIiiAkService } from './cdm-ams-iii-ak.service';
import { ResponseDto } from './dto/response.dto';
import { CdmAmsIiiAkReqMsg } from './message/cdm-ams-iii-ak-req-msg';
import { CdmAmsIiiAkResMsg } from './message/cdm-ams-iii-ak-res-msg';

@Controller('cdm-ams-iii-ak')
export class CdmAmsIiiAkController {
  constructor(
    public service: CdmAmsIiiAkService
  ) { }

  @Post('cdm-ams-iii-ak')
  public emission(@Body() req: CdmAmsIiiAkReqMsg): CdmAmsIiiAkResMsg {

    let response: CdmAmsIiiAkResMsg;
    let responseArray = new Array();

    for (let arr in req.baseline){

      let baseResponse = new ResponseDto();
      baseResponse.year = req.baseline[arr].year;
      baseResponse.baseLineEmission = this.service.baselineEmission(req.baseline[arr])
      baseResponse.projectEmission = this.service.projectEmission(req.project[arr])
      baseResponse.emissionReduction = baseResponse.baseLineEmission - 
                Math.max((baseResponse.projectEmission + this.service.leakageEmission(req.leakage[arr])), 0)

      responseArray.push(baseResponse);
    }
    response.response = responseArray;
    response.metaData = req
    return response;
  }
}
