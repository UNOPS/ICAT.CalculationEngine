import { Injectable } from '@nestjs/common';
import { BaselineDto } from './dto/baseline.dto';
import { ProjectDto } from './dto/project.dto';
import { ResponseDto } from './dto/response.dto';
import { CdmAmsIIIATReqMsg } from './message/cdm-ams-iii-at-req-msg';
import { CdmAmsIIIATResMsg } from './message/cdm-ams-iii-at-res-msg';

@Injectable()
export class CdmAmsIIIATService {
  public bfy = 0;
  public ncvbf = 0;

  public AMSIIIATEmission(req: CdmAmsIIIATReqMsg) {
    const response: CdmAmsIIIATResMsg = new CdmAmsIIIATResMsg();
    const responseArray = [];

    for (const arr in req.baseline) {
      console.log(arr);

      const baseResponse = new ResponseDto();
      baseResponse.year = req.baseline[arr].year;
      baseResponse.baseLineEmission = this.baselineEmission(req.baseline[arr]);
      baseResponse.projectEmission = this.projectEmission(req.project[arr]);
      baseResponse.emissionReduction =
        baseResponse.baseLineEmission - baseResponse.projectEmission;

      console.log(baseResponse);

      responseArray.push(baseResponse);
    }
    response.response = responseArray;
    response.metaData = req;
    return response;
  }

  // calculate baseline emission
  public baselineEmission(baseline: BaselineDto) {
    let emission = 0;
    const vehicle = baseline.vehicle;

    let befv = 0;
    let bepv = 0;
    for (const _vehicle of vehicle) {
      if (_vehicle.dpfv && _vehicle.pfv) {
        let distEmissionfv = 0;
        let beffv = 0;
        for (const _fuel of _vehicle.fuel) {
          distEmissionfv +=
            _vehicle.dfv * _vehicle.nbl * _fuel.ncv * _fuel.efco2;
        }
        beffv = distEmissionfv / (_vehicle.pfvb * _vehicle.dpfvb);
        befv += _vehicle.pfv * beffv * _vehicle.dpfv;
      } else {
        const befpv =
          _vehicle.nbl * _vehicle.fuel[0].ncv * _vehicle.fuel[0].efco2;
        bepv += _vehicle.npv * _vehicle.adpv * befpv;
      }
    }
    emission = befv + bepv;
    return emission;
  }

  // calculate project emission
  public projectEmission(project: ProjectDto) {
    let emission = 0;
    const vehicle = project.vehicle;

    let pefv = 0;
    let pepv = 0;
    for (const _vehicle of vehicle) {
      if (_vehicle.fcfv) {
        for (const _fuel of _vehicle.fuel) {
          pefv += _vehicle.fcfv * _fuel.ncv * _fuel.efco2;
        }
      } else {
        for (const _fuel of _vehicle.fuel) {
          pepv += _vehicle.fcpv * _fuel.ncv * _fuel.efco2;
        }
      }
    }
    emission = pefv + pepv;
    return emission;
  }
}
