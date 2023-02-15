import { Injectable } from '@nestjs/common';
import { VehicleTypeEnum } from '../enum/vehicle-type.enum';
import { baselineDto } from './dto/baseline.dto';
import { MacFuelGeneraInputlDto } from './dto/mac-fuel-general-input.dto';
import { MacFuelProjectDto } from './dto/mac-fuel-project.dto';
import { MacFuelReferenceDto } from './dto/mac-fuel-reference.dto';
import { MacVehicleDto } from './dto/mac-vahicle.dto';
import { projectDto } from './dto/project.dto';
import { UnfccAmsIIIBcReqMsg } from './message/unfccc-ams-iii-bc-req-msg';
import { UnfcccAmsIIIBcResMsg } from './message/unfccc-ams-iii-bc-res-msg';

@Injectable()
export class UnfcccAmsIiiBcService {
  ///---------------
  public ICATM1(req: UnfccAmsIIIBcReqMsg) {
    const response = new UnfcccAmsIIIBcResMsg();
    for (const num in req.baseline) {
      var responseArray = [];

      const baselineEmissionHeavy = this.baselineEmissionHeavy(
        req.baseline[num],
      );

      const baselineEmissionOther = this.baselineEmissionOther(
        req.baseline[num],
      );

      const projectEmissionHeay = this.projectEmissionHeavy(req.project[num]);

      const projectEmissionOther = this.projectEmissionOther(req.project[num]);

      response.year = req.baseline[num].year;

      response.baselineEmission = baselineEmissionHeavy + baselineEmissionOther;

      response.projectEmission = projectEmissionHeay + projectEmissionOther;

      response.leakegeEmission = 0;

      response.emissionReduction =
        response.baselineEmission - response.projectEmission;

      responseArray.push(response);
    }

    return responseArray;
  }
  ///------------

  public baselineEmissionHeavy(baseline: baselineDto) {
    let BEyt = 0;
    let beftkmixy = 0;
    let BEy: number;
    let altkmixy: number;

    for (const num in baseline.vehicle) {
      if (baseline.vehicle[num].type == VehicleTypeEnum.heavy_duty) {
        if (baseline.vehicle[num].altkmixy > 0) {
          altkmixy = baseline.vehicle[num].altkmixy;
        } else {
          altkmixy =
            baseline.vehicle[num].avgweightbyvehicle *
            baseline.vehicle[num].totaldistancetravel;
        }

        if (baseline.vehicle[num].beftkmixy > 0) {
          beftkmixy = baseline.vehicle[num].beftkmixy;
        } else {
          beftkmixy =
            (baseline.vehicle[num].sfcblixy *
              baseline.vehicle[num].fuel.ncv *
              baseline.vehicle[num].fuel.efco2xy) /
            baseline.vehicle[num].awblixy;
        }

        BEy = beftkmixy * altkmixy * 0.000001;

        BEyt += BEy;
      }
    }

    return BEyt;
  }

  public baselineEmissionOther(baseline: baselineDto) {
    let BEyt = 0;
    let BEy: number;
    let befkmixy = 0;
    let alkmixy: number;
    for (const num in baseline.vehicle) {
      if (baseline.vehicle[num].type == VehicleTypeEnum.light_duty) {
        if (baseline.vehicle[num].altkmixy) {
          alkmixy = baseline.vehicle[num].altkmixy;
        } else {
          alkmixy =
            baseline.vehicle[num].avgweightbyvehicle *
            baseline.vehicle[num].totaldistancetravel;
        }

        if (baseline.vehicle[num].beftkmixy > 0) {
          befkmixy = baseline.vehicle[num].beftkmixy;
        } else {
          befkmixy =
            baseline.vehicle[num].sfcblixy *
            baseline.vehicle[num].fuel.ncv *
            baseline.vehicle[num].fuel.efco2xy;
        }

        BEy = befkmixy * alkmixy * 0.000001;

        BEyt += BEy;
      }
    }

    return BEyt;
  }

  public projectEmissionHeavy(project: projectDto) {
    let PEyt = 0;
    let PEy: number;
    let beftkmixy = 0;
    let altkmixy = 0;
    for (const num in project.vehicle) {
      if (project.vehicle[num].type == VehicleTypeEnum.heavy_duty) {
        if (project.vehicle[num].altkmixy) {
          altkmixy = project.vehicle[num].altkmixy;
        } else {
          altkmixy =
            project.vehicle[num].avgweightbyvehicle *
            project.vehicle[num].totaldistancetravel;
        }

        if (project.vehicle[num].beftkmixy > 0) {
          beftkmixy = project.vehicle[num].beftkmixy;
        } else {
          beftkmixy =
            (project.vehicle[num].sfcblixy *
              project.vehicle[num].fuel.ncv *
              project.vehicle[num].fuel.efco2xy) /
            project.vehicle[num].awblixy;
        }

        PEy = beftkmixy * altkmixy * 0.000001;

        PEyt += PEy;
      }
    }

    return PEyt;
  }

  public projectEmissionOther(project: projectDto) {
    let PEyt = 0;
    let PEy: number;
    let befkmixy = 0;
    let alkmixy: number;
    for (const num in project.vehicle) {
      if (project.vehicle[num].type == VehicleTypeEnum.light_duty) {
        if (project.vehicle[num].altkmixy) {
          alkmixy = project.vehicle[num].altkmixy;
        } else {
          alkmixy =
            project.vehicle[num].avgweightbyvehicle *
            project.vehicle[num].totaldistancetravel;
        }

        if (project.vehicle[num].beftkmixy > 0) {
          befkmixy = project.vehicle[num].beftkmixy;
        } else {
          befkmixy =
            project.vehicle[num].sfcblixy *
            project.vehicle[num].fuel.ncv *
            project.vehicle[num].fuel.efco2xy;
        }

        PEy = befkmixy * alkmixy * 0.000001;
        PEyt += PEy;
      }
    }

    return PEyt;
  }

  //Mac-Calculations
  public projecttotalInvestment(totalinvestmet: MacFuelGeneraInputlDto) {
    const projecttotalinvestment =
      totalinvestmet.annualActivity * totalinvestmet.investmentPerTestCenter;

    return projecttotalinvestment;
  }

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

  public annual_OM(annualom: MacFuelGeneraInputlDto) {
    const annualoandm =
      annualom.annualActivity *
      annualom.investmentPerTestCenter *
      annualom.annualOAndMOfTestCenter;

    return annualoandm;
  }

  public annualFuelCost(vehicle: MacFuelProjectDto) {
    for (const num in vehicle.vehicle) {
      let tafc = 0;

      const annualTestFailuresVehicles: number =
        this.annualTestFailuresVehicles(vehicle.vehicle[num]);

      const totAnnualTravelOfAboveVehicles: number =
        (annualTestFailuresVehicles * vehicle.vehicle[num].novehicles) /
        1000000;

      const tspecificFuelConsumption: number =
        vehicle.vehicle[num].fuel.SpecificFuelConsumption *
        (1 + vehicle.vehicle[num].fuel.fuelSavingMaintenance / 100);

      const annualFuelConsumption: number =
        totAnnualTravelOfAboveVehicles / tspecificFuelConsumption;

      const afc: number =
        annualFuelConsumption * vehicle.vehicle[num].fuel.price;

      tafc += afc;

      return tafc;
    }
  }

  public annualTestFailuresVehicles(vehicle: MacVehicleDto) {
    let atfr: number;
    if (vehicle.usedInCalculations === 1) {
      atfr =
        (vehicle.testFailRate *
          vehicle.totVehicles *
          vehicle.shareOfVehicles *
          vehicle.percentageOfFuelVehicles) /
        1000000;
    } else {
      atfr = 0;
    }
    return atfr;
  }

  public referenceAnnualFuelCost(vehicle: MacFuelReferenceDto) {
    for (const num in vehicle.vehicle) {
      let tafc = 0;

      const annualTestFailuresVehicles: number =
        this.annualTestFailuresVehicles(vehicle.vehicle[num]);

      const totAnnualTravelOfAboveVehicles: number =
        (annualTestFailuresVehicles * vehicle.vehicle[num].novehicles) /
        1000000;
      const annualFuelConsumption: number =
        totAnnualTravelOfAboveVehicles /
        vehicle.vehicle[num].fuel.SpecificFuelConsumption;

      const afc: number =
        annualFuelConsumption * vehicle.vehicle[num].fuel.price;

      tafc += afc;

      return tafc;
    }
  }
}
