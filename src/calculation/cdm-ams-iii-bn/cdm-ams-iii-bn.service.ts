import { Injectable } from '@nestjs/common';
import { BaselineDto } from './dto/baseline.dto';
import { ProjectDto } from './dto/project.dto';
import { ResponseDto } from './dto/response.dto';
import { CdmAmsIiiBnReq } from './message/cdm-ams-iii-bn-req';
import { CdmAmsIiiBnRes } from './message/cdm-ams-iii-bn-res';

@Injectable()
export class CdmAmsIiiBnService {
  public AMSIIIBNEmission(req: CdmAmsIiiBnReq) {
    const response: CdmAmsIiiBnRes = new CdmAmsIiiBnRes();
    const responseArray = [];

    for (const arr in req.baseline) {
      console.log(arr);

      const baseResponse = new ResponseDto();
      baseResponse.year = req.baseline[arr].year;
      const secbl = this.baselineEmission(req.baseline[arr]);
      const project = this.projectEmission(req.project[arr]);
      const secpr = project.secpk;
      const efco2 = project.emissions;
      const pk = project.pk;
      const avdk = project.avdk;
      let baselineEmission = 0;
      let projectEmission = 0;

      for (const ele in secbl) {
        baselineEmission +=
          pk[ele] * avdk[ele] * efco2[ele] * (secbl[ele] / secpr[ele]);
        projectEmission += pk[ele] * avdk[ele] * efco2[ele];
        // er += pk[ele] * avdk[ele] * efco2[ele]* ((secbl[ele]/secpr[ele])-1)
      }
      baseResponse.baseLineEmission = baselineEmission;
      baseResponse.projectEmission = projectEmission;
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
    const emissions = [];
    const route = baseline.route;
    let secFossil = 0;
    let secElec = 0;

    for (const _route of route) {
      for (const vehicle of _route.vehicle) {
        for (const fuel of vehicle.fuel) {
          if (fuel.type === 'Electricity') {
            secElec = (fuel.ecConsumption * 3.6) / (1 - fuel.tdlgrid);
            console.log('secElec', secElec, fuel.ecConsumption, fuel.tdlgrid);
          } else {
            secFossil += fuel.fuelConsumption * fuel.ncv;
            console.log('secFossil', secFossil);
          }
        }
      }
      emissions.push((secFossil + secElec) / _route.pk);
    }
    console.log('emissions', emissions);

    return emissions;
  }

  // calculate project emission
  public projectEmission(project: ProjectDto) {
    const emissions = [];
    const secpk = [];
    const pk = [];
    const avdk = [];
    const route = project.route;
    let efFossil = 0;
    let efElec = 0;
    let secElec = 0;
    let secFossil = 0;

    for (const _route of route) {
      for (const vehicle of _route.vehicle) {
        for (const fuel of vehicle.fuel) {
          if (fuel.type === 'Electricity') {
            efElec = (fuel.ecConsumption * fuel.efkgrid) / (1 - fuel.tdlgrid);
            secElec = (fuel.ecConsumption * 3.6) / (1 - fuel.tdlgrid);
          } else {
            efFossil += fuel.fuelConsumption * fuel.ncv * fuel.efco2;
            secFossil += fuel.fuelConsumption * fuel.ncv;
          }
        }
      }
      emissions.push((efElec + efFossil) / (_route.p * _route.avdk));
      secpk.push((secFossil + secElec) / (_route.p * _route.avdk));
      pk.push(_route.p);
      avdk.push(_route.avdk);
    }

    console.log(emissions, secpk, pk, avdk);

    return {
      emissions: emissions,
      secpk: secpk,
      pk: pk,
      avdk: avdk,
    };
  }
}
