import { Injectable } from '@nestjs/common';
import { ProjectEmissionTypeEnum } from '../enum/project-emisson-type.enum';
import { BaseLineDto } from './dto/baseline.dto';
import { ProjectDto } from './dto/project.dto';
import { JicaRailwayFreightReqMsg } from './message/req.msg';
import { ResponseMsg } from './message/res.msg';

@Injectable()
export class JicaRailwayFreightService {
  public cal(req: JicaRailwayFreightReqMsg) {
    const responsemsg = new ResponseMsg();

    for (const arr in req.baselineEmission) {
      const baseLineEmission = this.baselineEmission(
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

  public baselineEmission(baseline: BaseLineDto, project: ProjectDto) {
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
        const be =
          (project.btkm * baseline.vehicle[i].ms * baseline.vehicle[i].ef_km) /
          100;
        base += be;
      }
    }
    return base;
  }

  public projectEmission(project: ProjectDto) {
    return project.ec * project.ef;
  }
}
