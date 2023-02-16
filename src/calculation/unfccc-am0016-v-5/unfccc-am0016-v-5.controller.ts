import { Body, Controller, Post } from '@nestjs/common';
import { UnfcccAm0016V5ReqMsg } from './message/unfccc-am0016-v-5-req-msg';
import { UnfcccAm0016V5ResMsg } from './message/unfccc-am0016-v-5-res-msg';
import { UnfcccAm0016V5Service } from './unfccc-am0016-v-5.service';

@Controller('unfccc-am0016-v-5')
export class UnfcccAm0016V5Controller {
  constructor(public service: UnfcccAm0016V5Service) {}

  @Post('/ghg')
  private ICATM(@Body() req: UnfcccAm0016V5ReqMsg) {
    const response = new UnfcccAm0016V5ResMsg();
    const responseArray = [];

    for (const num in req.baseline) {
      response.baselineEmission = this.service.baselineEmission(
        req.baseline[num],
      );
      responseArray.push(response);
    }

    return responseArray;
  }
}
