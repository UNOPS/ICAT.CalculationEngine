import { Injectable } from '@nestjs/common';
import { ProjectEmissionTypeEnum } from '../enum/project-emisson-type.enum';
import { BaseLineDto } from './dto/baseline.dto';
import { ProjectDto } from './dto/project.dto';
import { JicaRailwayPassengerReqMsg } from './message/req.msg';
import { ResponseMsg } from './message/res.msg';

@Injectable()
export class JicaRailwayPassengerService {
  public cal(req: JicaRailwayPassengerReqMsg) {
    const responsemsg = new ResponseMsg();

    for (const arr in req.baselineEmission) {
      const baseLineEmission = this.baseline(
        req.baselineEmission[arr],
        req.projectEmission,
      );
      const projectEmission = this.projectEmission(req.projectEmission);
      const emissionReduction = baseLineEmission - projectEmission;

      responsemsg.year = req.projectEmission.year;
      responsemsg.baseLineEmission = parseFloat(
        Number(baseLineEmission).toFixed(5),
      );
      responsemsg.projectEmission = parseFloat(
        Number(projectEmission).toFixed(5),
      );
      responsemsg.emissionReduction = parseFloat(
        Number(emissionReduction).toFixed(5),
      );
    }

    console.log(responsemsg);
    return responsemsg;
  }

  public projectEmission(project: ProjectDto) {
    return project.ec * project.ef;
  }

  public baseline(baseline: BaseLineDto, project: ProjectDto) {
    let base = 0;

    if (
      baseline.baselineEmissonType == ProjectEmissionTypeEnum.electrification
    ) {
      for (const i in baseline.vehicle) {
        const be =
          baseline.vehicle[i].fuel.fc *
          baseline.vehicle[i].fuel.ncv *
          baseline.vehicle[i].fuel.ef;
        base += be;
      }
    } else if (
      baseline.baselineEmissonType == ProjectEmissionTypeEnum.model_shift
    ) {
      for (const i in baseline.vehicle) {
        const com =
          (project.p * baseline.vehicle[i].ms * project.btdp) /
          baseline.vehicle[i].or;
        if (baseline.vehicle[i].ef_km > 0) {
          const be = com * baseline.vehicle[i].ef_km;
          base += be;
        } else {
          const be =
            com *
            baseline.vehicle[i].fuel.ncv *
            baseline.vehicle[i].fuel.ef *
            baseline.vehicle[i].sfc;
          base += be;
        }
      }
    }
    return base;
  }
}
