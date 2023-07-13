import { Body, Controller, Post } from '@nestjs/common';
import { CdmAcm0017Service } from './cdm-acm0017.service';

@Controller('cdm-ams-iii-ak')
export class CdmAcm0017Controller {
  constructor(
    public service: CdmAcm0017Service
  ) { }

  // @Post('cdm-ams-iii-ak')
  // public emission(@Body() req: CdmAmsIiiAkReqMsg): CdmAmsIiiAkResMsg {

  //   let response: CdmAmsIiiAkResMsg;
  //   let responseArray = new Array();

  //   for (let arr in req.baseline){

  //     let baseResponse = new ResponseDto();
  //     baseResponse.year = req.baseline[arr].year;
  //     baseResponse.baseLineEmission = this.service.baselineEmission(req.baseline[arr])
  //     baseResponse.projectEmission = this.service.projectEmission(req.project[arr])
  //     baseResponse.emissionReduction = baseResponse.baseLineEmission - 
  //               Math.max((baseResponse.projectEmission + this.service.leakageEmission(req.leakage[arr])), 0)

  //     responseArray.push(baseResponse);
  //   }
  //   response.response = responseArray;
  //   response.metaData = req
  //   return response;
  // }
}
