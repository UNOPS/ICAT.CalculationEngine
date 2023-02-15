import { Injectable } from '@nestjs/common';
import { baselineDto } from './dto/baseline.dto';
import { projectDto } from './dto/project.dto';
import { UnfcccAm0090V0110ReqMsg } from './message/unfccc_am0090_v_01_1_0_req_msg';
import { UnfcccAm0090V0110ResMsg } from './message/unfccc_am0090_v_01_1_0_res_msg';

@Injectable()
export class UnfcccAm0090V0110Service {
  public ICATM2(req: UnfcccAm0090V0110ReqMsg) {
    const responseArray = [];

    for (const num in req.baseline) {
      const response = new UnfcccAm0090V0110ResMsg();

      response.year = req.baseline[num].year;

      response.baselineEmission = this.baselineEmission(req.baseline[num]);

      response.projectEmission = this.projectEmission(req.project[num]);

      response.emissionReduction =
        response.baselineEmission - response.projectEmission;

      responseArray.push(response);
    }
    return responseArray;
  }

  public baselineEmission(baseline: baselineDto) {
    let Efbl = 0;

    if (baseline.cdefault) {
      Efbl = baseline.cdefault;
    } else {
      Efbl = this.efblHistorical(baseline);
    }

    const BEy = baseline.ty * baseline.ad * Efbl * 0.000001;

    return BEy;
  }

  public efblHistorical(baseline: baselineDto) {
    let Efbl = 0;
    let frtbl = 0;
    for (const num in baseline.vehicle) {
      if (baseline.frtbl) {
        frtbl = baseline.frtbl;
      } else {
        frtbl =
          (baseline.tx * baseline.ad) /
          (baseline.tx * baseline.ad + baseline.trtx * baseline.rtdx);
      }

      const efbl_historic: number =
        baseline.vehicle[num].fuel.fcblix *
        baseline.vehicle[num].fuel.ncv *
        baseline.vehicle[num].fuel.efco2 *
        frtbl;
      Efbl += efbl_historic;
    }

    return Efbl / (baseline.tx * baseline.ad);
  }

  public projectEmission(project: projectDto) {
    const emissionfossilfuel: number = this.emissionFossilFuel(project);
    const emissionelectricity: number = this.emissionElectricity(project);
    const factornonemptyreturn: number = this.nonemptyReturns(project);
    const emissiontranspotationcargo: number =
      this.emissionTanspotationCargo(project);
    const projectemission: number =
      (emissionfossilfuel + emissionelectricity) * factornonemptyreturn +
      emissiontranspotationcargo;

    return projectemission;
  }

  public emissionFossilFuel(project: projectDto) {
    let pefcjy: number;
    let coefiy: number;
    let pefcjyt = 0;

    for (const num in project.vehicle) {
      if (
        project.vehicle[num].type == 'ships' ||
        project.vehicle[num].type == 'barges' ||
        project.vehicle[num].type == 'trains'
      ) {
        if (project.vehicle[num].fuel.type !== 'Electricity') {
          if (project.vehicle[num].fuel.coefiy > 0) {
            coefiy = project.vehicle[num].fuel.coefiy;

            pefcjy = coefiy * project.vehicle[num].fuel.fcijy; //*1000

            pefcjyt += pefcjy;
          } else if (
            project.vehicle[num].fuel.efco2 &&
            project.vehicle[num].fuel.ncv
          ) {
            coefiy =
              project.vehicle[num].fuel.ncv * project.vehicle[num].fuel.efco2; //divided by 1000000

            pefcjy = coefiy * project.vehicle[num].fuel.fcijy; //*1000

            pefcjyt += pefcjy;
          } else {
            if (project.vehicle[num].fuel.piy) {
              coefiy =
                (project.vehicle[num].fuel.wciy *
                  project.vehicle[num].fuel.piy *
                  44) /
                12;

              pefcjy = coefiy * project.vehicle[num].fuel.fcijy;

              pefcjyt += pefcjy;
            } else {
              coefiy = (project.vehicle[num].fuel.wciy * 44) / 12;

              pefcjy = coefiy * project.vehicle[num].fuel.fcijy;

              pefcjyt += pefcjy;
            }
          }
        } else {
          return 0;
        }
      }
    }

    return pefcjyt;
  }

  public emissionElectricity(project: projectDto) {
    let peecy = 0;
    let peecyt = 0;

    for (const num in project.vehicle) {
      if (project.vehicle[num].fuel.type == 'Electricity') {
        peecy =
          project.vehicle[num].fuel.fcijy *
          project.vehicle[num].fuel.efefjy *
          (1 + project.vehicle[num].fuel.tdljy / 100);
        peecyt += peecy;
      }
    }

    return peecyt;
  }

  public nonemptyReturns(project: projectDto) {
    const frtpjy: number = project.ty / (project.ty + project.trty);

    return frtpjy;
  }

  public emissionTanspotationCargo(project: projectDto) {
    let pefcry: number;
    let coefiy: number;
    let pefcryt = 0;

    for (const num in project.vehicle) {
      if (project.vehicle[num].type == 'trucks') {
        if (project.vehicle[num].fuel.efco2 && project.vehicle[num].fuel.ncv) {
          coefiy =
            (project.vehicle[num].fuel.ncv * project.vehicle[num].fuel.efco2) /
            1000000;

          pefcry = coefiy * project.vehicle[num].fuel.fcijy * 1000;

          pefcryt += pefcry;
        } else {
          if (project.vehicle[num].fuel.piy) {
            coefiy =
              (project.vehicle[num].fuel.wciy *
                project.vehicle[num].fuel.piy *
                44) /
              12;

            pefcry = coefiy * project.vehicle[num].fuel.fcijy;

            pefcryt += pefcry;
          } else {
            coefiy = (project.vehicle[num].fuel.wciy * 44) / 12;

            pefcry = coefiy * project.vehicle[num].fuel.fcijy;

            pefcryt += pefcry;
          }
        }

        return pefcryt;
      } else {
        return 0;
      }
    }
  }

  //MAC-Calculations
  public pmtCalculation(
    discount_rate: number,
    project_life: number,
    totalInvestment: number,
  ) {
    const presentage = 100;
    if (project_life == 0) {
      return 0;
    } else {
      const presentValueInterstFector = Math.pow(
        1 + discount_rate / presentage,
        project_life,
      );
      const pmt =
        ((discount_rate / presentage) *
          totalInvestment *
          presentValueInterstFector) /
        (presentValueInterstFector - 1);

      return pmt;
    }
  }

  public annual_OM(investment: number, anualOandM: number) {
    const presentage = 1000000;
    const annualoandm = (investment * anualOandM * presentage) / 100;

    return annualoandm;
  }

  public reference_annual_OM(
    anualOandM: number,
    investmentInOneTruck: number,
    dailyActivity: number,
    occupancy: number,
  ) {
    const numOfTrucks = dailyActivity / occupancy;
    const anualoandm = (anualOandM * investmentInOneTruck * numOfTrucks) / 100;

    return anualoandm;
  }

  public annualFuelCost(
    dailyActivity: number,
    specificDieselConsumption: number,
    oneUsGalon: number,
    OneMile: number,
    dieselPrice: number,
  ) {
    const annualfuelcost =
      (dieselPrice *
        dailyActivity *
        specificDieselConsumption *
        oneUsGalon *
        365) /
      OneMile;

    return annualfuelcost;
  }

  public reference_annualFuelCost(
    dailyActivity: number,
    dieselConsumption: number,
    dieselPrice: number,
  ) {
    const annualfuelcost = (dailyActivity * 365) / dieselConsumption;

    return annualfuelcost;
  }

  public totalAnualCost(
    LevInvestment: number,
    AnualOAndM: number,
    AnnuaFuelCost: number,
  ) {
    const totalAnualCost = LevInvestment + AnualOAndM + AnnuaFuelCost;

    return totalAnualCost;
  }
}
