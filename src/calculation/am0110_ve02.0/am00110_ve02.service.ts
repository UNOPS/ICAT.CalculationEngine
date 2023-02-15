import { Injectable } from '@nestjs/common';
import { BaseLineDto } from './dto/baseline.dto';
import { Am0110ReqMsg } from './message/am0110_ve02-req-msg';
import { ProjectDto } from './dto/project.dto';
import { FuelDto } from '../unfccc-ams-iii-s-v-4/dto/fuel.dto';
import { VehicleTypeEnum } from '../enum/vehicle-type.enum';
import { ResponseMsg } from '../jica-railway-freight/message/res.msg';

@Injectable()
export class AM0110VE02Service {
  public cal(req: Am0110ReqMsg) {
    const res = new ResponseMsg();
    let be = 0;
    let pe = 0;
    for (const i in req.baseline) {
      const base = this.baseline(req.baseline[i]);
      be += base;
    }

    for (const j in req.projectEmission) {
      // console.log("__________________",req.projectEmission[j])
      const pro = this.project(req.projectEmission[j]);
      pe += pro;
    }
    res.baseLineEmission = be;
    res.projectEmission = pe;
    res.emissionReduction = be - pe;

    return res;
  }

  public baseline(bas: BaseLineDto): number {
    const unit = 0.000001;
    let base = 0;
    for (const j in bas.routs) {
      let ef = 0;
      let ef_1 = 0;
      for (const i in bas.routs[j].vehicle) {
        const ef_2 =
          (bas.routs[j].vehicle[i].fuel.fc *
            bas.routs[j].vehicle[i].fuel.ncv *
            bas.routs[j].vehicle[i].fuel.ef) /
          (bas.routs[j].vehicle[i].t * bas.routs[j].distance);
        ef_1 += ef_2;
      }
      ef = ef_1;
      // }

      const be = bas.routs[j].distance * bas.routs[j].t_jy * ef * unit;
      base += be;
    }

    return base;
  }
  public project(pro: ProjectDto) {
    let PE = 0,
      PE_ec = 0,
      PE_ff = 0,
      PE_cr = 0,
      PE_cl = 0;

    for (const i in pro.rout) {
      let SC = 0,
        TAD = 0;
      const carbon = 44 / 12;

      PE_cl += pro.rout[i].L * pro.rout[i].M * pro.rout[i].W * 0.5 * carbon;
      for (const j in pro.rout[i].vehicle) {
        if (
          pro.rout[i].vehicle[j].vehicleType ===
          VehicleTypeEnum.electric_vehicle
        ) {
          PE_ec += this.electricityConsumtion(pro.rout[i].vehicle[j].fuel);
        }

        if (
          pro.rout[i].vehicle[j].vehiclety === VehicleTypeEnum.pipline &&
          pro.rout[i].vehicle[j].vehicleType === VehicleTypeEnum.fuel_vehicle
        ) {
          PE_ff += this.fosilFuelConsumtion(pro.rout[i].vehicle[j].fuel);
        } else if (
          pro.rout[i].vehicle[j].vehiclety != VehicleTypeEnum.pipline &&
          pro.rout[i].vehicle[j].vehicleType === VehicleTypeEnum.fuel_vehicle
        ) {
          if (pro.rout[i].vehicle[j].sfc > 0) {
            SC += pro.rout[i].vehicle[j].sfc / pro.rout[i].vehicle[j].n;
            console.log('1');
          } else if (pro.rout[i].vehicle[j].fuel.fc > 0) {
            SC +=
              pro.rout[i].vehicle[j].fuel.fc /
              (pro.rout[i].t_k *
                pro.rout[i].distance *
                pro.rout[i].vehicle[j].n);
            console.log('2');
          } else {
            PE_cr += this.fosilFuelConsumtion(pro.rout[i].vehicle[j].fuel);
            console.log('3');
          }
        }
      }
      if (SC > 0) {
        for (const i in pro.rout) {
          for (const j in pro.rout[i].vehicle) {
            if (
              pro.rout[i].vehicle[j].vehiclety != VehicleTypeEnum.pipline &&
              pro.rout[i].vehicle[j].vehicleType ===
                VehicleTypeEnum.fuel_vehicle
            ) {
              console.log('4');
              TAD += pro.rout[i].t_k * pro.rout[i].distance;
            }
          }
        }
        const fc = SC * TAD;

        for (const i in pro.rout) {
          for (const j in pro.rout[i].vehicle) {
            if (
              pro.rout[i].vehicle[j].vehiclety != VehicleTypeEnum.pipline &&
              pro.rout[i].vehicle[j].vehicleType ===
                VehicleTypeEnum.fuel_vehicle
            ) {
              if (pro.rout[i].vehicle[j].fuel.coef_volume > 0) {
                PE_cr += fc * pro.rout[i].vehicle[j].fuel.coef_volume;
                console.log('5');
              } else {
                console.log('6');
                PE_cr +=
                  fc *
                  pro.rout[i].vehicle[j].fuel.w *
                  pro.rout[i].vehicle[j].fuel.density *
                  carbon;
                console.log(PE_cr);
              }
            }
          }
        }
      }
    }
    console.log(
      'PE_ec ',
      PE_ec,
      '  PE_ff ',
      PE_ff,
      '   PE_cr ',
      PE_cr,
      '   PE_cl ',
      PE_cl * 100,
    );
    PE = PE_ec + PE_ff + PE_cr + PE_cl * 100;
    return PE;
  }
  public electricityConsumtion(fuel: FuelDto) {
    return fuel.fc * fuel.ef * (1 + fuel.tdl);
  }
  public fosilFuelConsumtion(fuel: FuelDto) {
    const carbon = 44 / 12;

    if (fuel.fc > 0) {
      if (fuel.coef_volume > 0) {
        return fuel.fc * fuel.coef_volume;
      } else return fuel.fc * fuel.w * fuel.density * carbon;
    } else {
      if (fuel.coef_mass > 0) {
        return fuel.coef_mass * fuel.fc_mass;
      } else return fuel.fc_mass * fuel.w * fuel.density * carbon;
    }
  }
}
