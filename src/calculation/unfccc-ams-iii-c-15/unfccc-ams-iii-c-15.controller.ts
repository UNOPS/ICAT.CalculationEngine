import { Controller, Post, Body } from '@nestjs/common';
import { ResponseDto } from '../icat-tpm-2020/dto/response.dto';
import { UnfcccAmsIIIC15ReqMsg } from './message/unfccc-ams-iii-c-15-req-msg';
import { UnfcccAmsIIIC15ResponseMsg } from './message/unfccc-ams-iii-c-15-res-msg';
import { UnfcccAmsIiiC15Service } from './unfccc-ams-iii-c-15.service';

@Controller('unfccc-ams-iii-c-15')
export class UnfcccAmsIiiC15Controller {
  constructor(public service: UnfcccAmsIiiC15Service) {}

  @Post('')
  public ghgEmission(
    @Body() req: UnfcccAmsIIIC15ReqMsg,
  ): UnfcccAmsIIIC15ResponseMsg {
    const response = new UnfcccAmsIIIC15ResponseMsg();
    const responseArray = [];

    for (const num in req.baseline) {
      const baseResponse = new ResponseDto();

      const baseLineEmission = this.service.baselineEmission(
        req.baseline[num],
        req.project[num],
      );
      const projectEmission = this.service.projectEmission(req.project[num]);

      baseResponse.year = req.baseline[num].year;
      baseResponse.baseLineEmission = baseLineEmission;
      baseResponse.projectEmission = projectEmission;
      baseResponse.emissionReduction = baseLineEmission - projectEmission;

      responseArray.push(baseResponse);
    }

    response.response = responseArray;
    response.metaData = req;
    return response;
  }
}
