import { Injectable } from '@nestjs/common';
import { ProjectDto } from 'src/calculation/jica-tcm-ms-p-v-3/dto/project.dto';
import { ProjectEmissionTypeEnum } from '../enum/project-emisson-type.enum';
import { VehicleTypeEnum } from '../enum/vehicle-type.enum';
import { FuelDto } from '../unfccc-ams-iii-s-v-4/dto/fuel.dto';
import { BaseLineDto } from './dto/baseline.dto';
import { ResponseDto } from './dto/responce.dto';
import { TraficCongestionDto } from './dto/trafic-congestion.dto';
import { JicaTcmMsPV3ReqMsg } from './message/Jica-tcm-ms-p-v-3-req-msg';
import { JicaTcmMsPV3ResMsg } from './message/Jica-tcm-ms-p-v-3-res-msg';

@Injectable()
export class JicaTcmMsPV3Service {
  public modalShift(req: JicaTcmMsPV3ReqMsg) {
    const responseMasege = new JicaTcmMsPV3ResMsg();
    const responceArray = [];

    for (const arr in req.baselineEmission) {
      let baseLineEmission = 0;
      let projectEmission = 0;

      const response = new ResponseDto();
      const emission = this.baselineEmission(
        req.projectEmission[arr],
        req.baselineEmission[arr],
      );

      baseLineEmission += emission;

      if (
        req.projectEmission[arr].projectEmissonType ===
        ProjectEmissionTypeEnum.model_shift
      ) {
        if (
          req.projectEmission[arr].vehicle_type == VehicleTypeEnum.fuel_vehicle
        ) {
          const emission: number = this.projectEmissonForFuel(
            req.projectEmission[arr],
          );

          projectEmission += emission;
        } else if (
          req.projectEmission[arr].vehicle_type ==
          VehicleTypeEnum.electric_vehicle
        ) {
          let emission: number;
          if (req.projectEmission[arr].ec === 0) {
            emission = this.projectEmissonForElectricityWithDistance(
              req.projectEmission[arr].distance,
              req.projectEmission[arr].sfc,
              req.projectEmission[arr].ef,
            );
          } else {
            emission = this.projectEmissonForElectricity(
              req.projectEmission[arr].ec,
              req.projectEmission[arr].ef,
            );
          }
          projectEmission += emission;
        }
      } else if (
        req.projectEmission[arr].projectEmissonType ===
        ProjectEmissionTypeEnum.traffic_congestion_mitigation
      ) {
        for (const num in req.projectEmission[arr].fc) {
          const emission: number = this.trafficCongestionMitigation(
            req.projectEmission[arr],
            req.projectEmission[arr].traficCon[num],
            req.projectEmission[arr].fc[num],
          );

          projectEmission += emission;
        }
      }

      response.year = req.projectEmission[arr].year;
      response.baseLineEmission = parseFloat(
        Number(baseLineEmission).toFixed(5),
      );
      response.projectEmission = parseFloat(Number(projectEmission).toFixed(5));
      response.emissionReduction = parseFloat(
        Number(baseLineEmission - projectEmission).toFixed(5),
      );

      responceArray.push(response);
    }
    responseMasege.metaData = req;
    responseMasege.response = responceArray;
    return responseMasege;
  }

  //calculate baseline emission
  public baselineEmission(project: ProjectDto, baseline: BaseLineDto): number {
    //calculate baseline emission with project distance
    if (project.distance != 0) {
      //calculate baseline emission with project distance and CO2 emission factor per passenger
      let baselineEmission = 0;
      for (const num in baseline.vehicle) {
        if (baseline.vehicle[num].ef_pkm != 0) {
          const emission =
            (project.distance *
              baseline.vehicle[num].ef_pkm *
              baseline.vehicle[num].ms) /
            100;

          baselineEmission += emission;
        }

        //calculate baseline emission with project distance and CO2 emission factor of transport mode
        else if (baseline.vehicle[num].ef_pkm == 0) {
          const emission =
            (project.distance *
              baseline.vehicle[num].ms *
              baseline.vehicle[num].ef_km) /
            (baseline.vehicle[num].or * 100);
          baselineEmission += emission;
        }
      }

      return baselineEmission;
    }

    //calculate baseline emission with Average trip distance
    else if (project.distance === 0) {
      let baselineEmission = 0;

      for (const num in baseline.vehicle) {
        if (baseline.vehicle[num].ef_pkm != 0) {
          const emission =
            (project.passenger *
              project.btdp *
              baseline.vehicle[num].ef_pkm *
              baseline.vehicle[num].ms) /
            100;
          baselineEmission += emission;
        } else if (baseline.vehicle[num].ef_pkm === 0) {
          if (baseline.vehicle[num].ef_km != 0) {
            const emission =
              (project.passenger *
                project.btdp *
                baseline.vehicle[num].ms *
                baseline.vehicle[num].ef_km) /
              (baseline.vehicle[num].or * 100);
            baselineEmission += emission;
          } else if (baseline.vehicle[num].ef_km == 0) {
            const emission =
              (project.passenger *
                project.btdp *
                baseline.vehicle[num].ms *
                baseline.vehicle[num].sfc *
                baseline.vehicle[num].fuel.ncv *
                baseline.vehicle[num].fuel.ef) /
              (baseline.vehicle[num].or * 100);

            baselineEmission += emission;
          }
        }
      }
      return baselineEmission;
    }
  }

  public projectEmissonForFuel(project: ProjectDto) {
    let projectEmission = 0;
    const unitConversion = 1000000;

    for (const num in project.fc) {
      let emission: number;
      if (project.fc[num].fc > 0) {
        emission =
          project.fc[num].ncv * project.fc[num].ef * project.fc[num].fc;
        projectEmission += emission;
      } else if (project.fc[num].fc == 0) {
        emission =
          (project.fc[num].ncv *
            project.fc[num].ef *
            project.distance *
            project.sfc) /
          unitConversion;
        projectEmission += emission;
      }
    }

    return projectEmission;
  }

  public projectEmissonForElectricity(ec: number, ef: number) {
    return ec * ef;
  }

  public projectEmissonForElectricityWithDistance(
    distanse: number,
    sfc: number,
    ef: number,
  ) {
    return distanse * sfc * ef;
  }

  public trafficCongestionMitigation(
    project: ProjectDto,
    traficCon: TraficCongestionDto,
    fuel: FuelDto,
  ) {
    let projectEmission = 0;
    if (traficCon.efkm != 0) {
      if (project.distance > 0) {
        const emission =
          (project.distance * traficCon.ms * traficCon.efkm) / traficCon.or;
        projectEmission += emission;
      } else {
        const emission =
          (project.passenger * project.btdp * traficCon.ms * traficCon.efkm) /
          traficCon.or;
        projectEmission += emission;
      }

      return projectEmission;
    } else if (traficCon.efkm === 0) {
      if (project.distance > 0) {
        const emission =
          (project.distance *
            traficCon.ms *
            fuel.ef *
            fuel.ncv *
            traficCon.sfc) /
          traficCon.or;
        projectEmission += emission;
      } else {
        const emission =
          (project.passenger *
            project.btdp *
            traficCon.ms *
            fuel.ef *
            fuel.ncv *
            traficCon.sfc) /
          traficCon.or;
        projectEmission += emission;
      }

      return projectEmission;
    }
  }
}
