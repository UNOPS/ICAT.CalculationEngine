import { Injectable } from '@nestjs/common';
import { BaselineDto } from './dto/baseline.dto';
import { LeakageDto } from './dto/leakage.dto';
import { ProjectDto } from './dto/project.dto';
import { ResponseDto } from './dto/response.dto';
import { CdmAcm0017ReqMsg } from './message/cdm-acm0017-req-msg';
import { CdmAcm0017ResMsg } from './message/cdm-acm0017-res-msg';

@Injectable()
export class CdmAcm0017Service {
  public bfy = 0;
  public ncvbf = 0;

  public ACM0017Emission(req: CdmAcm0017ReqMsg) {
    const response: CdmAcm0017ResMsg = new CdmAcm0017ResMsg();
    const responseArray = [];

    for (const arr in req.baseline) {
      const baseResponse = new ResponseDto();
      baseResponse.year = req.baseline[arr].year;
      baseResponse.baseLineEmission = this.baselineEmission(req.baseline[arr]);
      baseResponse.projectEmission = this.projectEmission(req.project[arr]);
      baseResponse.leakageEmission = this.leakageEmission(req.leakage[arr]);
      baseResponse.emissionReduction =
        baseResponse.baseLineEmission -
        baseResponse.projectEmission -
        baseResponse.leakageEmission;

      responseArray.push(baseResponse);
    }
    response.response = responseArray;
    response.metaData = req;
    return response;
  }

  // calculate baseline emission
  public baselineEmission(baseline: BaselineDto) {
    const pp = baseline.powerplant;
    const fuels = pp.fuel;
    let emission = 0;
    let min1 = 0;
    let min2 = 0;
    let numerator = 0;
    let denominator = 0;
    let efco2 = 0;
    const fossilFuels = ['Diesel', 'Petrol'];

    min1 = pp.pbf - pp.pbfsite;

    for (const _fuel of fuels) {
      if (fossilFuels.includes(_fuel.type)) {
        efco2 = _fuel.efco2;
      } else {
        min2 = _fuel.fpj * _fuel.cbf;
        numerator = _fuel.cbf * ((_fuel.fpj - _fuel.freg) / _fuel.fpj);
        denominator = _fuel.cbf;
      }
    }

    this.bfy = (Math.min(min1, min2) - pp.pbfother) * (numerator / denominator);

    emission = this.bfy * pp.ncvbf * efco2;

    return emission;
  }

  // calculate project emission
  public projectEmission(project: ProjectDto) {
    let emission = 0;
    const powerPlant = project.powerplant;

    emission =
      this.biomassEmission(powerPlant) +
      powerPlant.af1 * this.methanolEmission(powerPlant.prfuel);

    return emission;
  }

  public biomassEmission(pp) {
    let emission = 0;
    let fsEmission = 0;

    for (const _fs of pp.feedstock) {
      fsEmission += _fs.as * _fs.efs;
    }

    const pebc = this.socEmission(pp.stratum, pp.t) + fsEmission;

    emission = pp.af1 * (pp.pebp + pp.pebt + pp.af2 * pebc);

    return emission;
  }

  public socEmission(stratum, t) {
    let diffSOC = 0;

    for (const _st of stratum) {
      diffSOC +=
        1.21 *
        _st.asoc *
        _st.socref *
        (_st.flub * _st.fmgb * _st.finb - _st.flup * _st.fmgp * _st.finp);
    }

    const emission = Math.max((44 / 12) * (1.179 / t) * diffSOC, 0);

    return emission;
  }

  public methanolEmission(fuel) {
    const emission = fuel.fuelConsumption * fuel.efcmeoh * (44 / 12);

    return emission;
  }

  //Calculate leakage emission
  public leakageEmission(leakage: LeakageDto) {
    let emission = 0;
    const fuel = leakage.fuel;
    let lemeoh = 0;
    let leff = 0;

    for (const _fuel of fuel) {
      if (_fuel.type === 'Methanol') {
        lemeoh = _fuel.fuelConsumption * _fuel.efmeoh;
      } else {
        leff += leakage.ncvbf * _fuel.efijx;
      }
    }

    const leffy = this.bfy * leff;

    emission += leakage.lebr + lemeoh - leffy;

    return emission;
  }
}
