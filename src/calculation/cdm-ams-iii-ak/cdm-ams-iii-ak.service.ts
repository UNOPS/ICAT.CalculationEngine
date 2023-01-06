import { Injectable } from '@nestjs/common';
import { BaselineDto } from './dto/baseline.dto';
import { LeakageDto } from './dto/leakage.dto';
import { ProjectDto } from './dto/project.dto';
import { ResponseDto } from './dto/response.dto';
import { CdmAmsIiiAkReqMsg } from './message/cdm-ams-iii-ak-req-msg';
import { CdmAmsIiiAkResMsg } from './message/cdm-ams-iii-ak-res-msg';

@Injectable()
export class CdmAmsIiiAkService {
    public bfy = 0;
    public ncvbf = 0;

    public AMSIIIEmission(req: CdmAmsIiiAkReqMsg){
        let response: CdmAmsIiiAkResMsg = new CdmAmsIiiAkResMsg();
        let responseArray = new Array();
    
        for (let arr in req.baseline){
    
          let baseResponse = new ResponseDto();
          baseResponse.year = req.baseline[arr].year;
          baseResponse.baseLineEmission = this.baselineEmission(req.baseline[arr])
          baseResponse.projectEmission = this.projectEmission(req.project[arr])
          baseResponse.leakageEmission = this.leakageEmission(req.leakage[arr])
          baseResponse.emissionReduction = baseResponse.baseLineEmission - 
                    Math.max((baseResponse.projectEmission + baseResponse.leakageEmission), 0)
    
          responseArray.push(baseResponse);
        }
        response.response = responseArray;
        response.metaData = req
        return response;
    }

    //calculate baseline emission
    public baselineEmission(baseline: BaselineDto) {
        let pp = baseline.powerplant;
        let fuel = pp.fuel;
        this.ncvbf = pp.ncvbf
        let ppEmission = (pp.pbf - pp.pbfsite - pp.pbfother)
        let vehicleEmission = ((pp.fpj * pp.fff * pp.cbf) - pp.pbfother)

        this.bfy = Math.min(ppEmission, vehicleEmission)

        let emission = this.bfy * this.ncvbf * fuel.efco2

        return emission;
    }

    //calculate project emission
    public projectEmission(project: ProjectDto) {
        let emission = 0;

        for (let fs of project.feedstock){
            let af1 = (fs.mpmp * fs. mmp)/ ((fs.mpmp * fs.mmp) + (fs.mpbp * fs. mbp)) 

            let FPBF = fs.fpbf
            let PETR = this.transportEmission(fs.vehicle)
            let PEBP = this.productionEmission(fs.fuel, fs)
            let PEMeOH = this.methonolEmission(fs.fuel)
            let AF2 = fs.af2
            let PEBC = this.cultivationEmission(fs, fs.soil, fs.stratum, fs.fuel, project.feedstock)

            emission += (FPBF * af1 * (PETR + PEBP + PEMeOH + AF2 * PEBC))
        }


        return emission;
    }

    productionEmission(fuel, fs) {
        let emission = fs.peww;
        for (let _fuel of fuel) {
            if (_fuel.type === "Electricity") {
                emission += _fuel.peec;
            } else if(_fuel.type !== "Electricity" && _fuel.type !== "Methanol") {
                emission += _fuel.pefc;
            }
        }
        return emission;
    }

    methonolEmission(fuel) {
        let emission = 0;
        for (let _fuel of fuel) {
            if (_fuel.type === "Methanol") {
                emission += _fuel.fuelConsumption * _fuel.efcm * (44 / 12);
            }
        }
        return emission;
    }

    transportEmission(vehicle) {
        let emission = 0;
        for (let _vehicle of vehicle) {
            emission += (_vehicle.df * _vehicle.fr * _vehicle.efco2 * Math.pow(10, -6))
        }
        return emission;
    }

    cultivationDefaultEmission(fs) {
        let emission = 0;
        for (let _fs of fs){
            if (_fs.efs){
                emission += _fs.as * _fs.efs
            }
        }
        return emission;
    }

    cultivationEmission(fs, soil, stratum, fuel, feedstock) {
        let emission = 0;
        let losSOC = 0;
        let pesa = 0;
        let pebsh = 0;
        let pebb = 0;

        for (let _soil of soil) {
            pesa += _soil.qsa * _soil.asa * _soil.efsa
        }

        for (let _stratum of stratum) {
            losSOC += (1.21 * _stratum.asoc * _stratum.socref) *
                ((_stratum.flub * _stratum.fmgb * _stratum.finb) - (_stratum.flup * _stratum.fmgp * _stratum.finp))

            if(_stratum.afr && _stratum.b && _stratum.r){
                pebb += _stratum.afr * _stratum.b * (1.06 + _stratum.r);
            }
        }

        pebb = pebb * (44/12) * 0.47;

        let pesoc = Math.max(((44 / 12) * (1.179 / fs.t) * losSOC), 0)

        let pesf = 0; let pesm = 0;
        if(pesa !== 0){
            pesf = fs.qn * fs.aftm * fs.efft
            pesm = pesf + pesa
        }
        

        for (let _fuel of fuel) {
            if (_fuel.type === "Electricity"){
                _fuel.pebshe ? pebsh += _fuel.pebshe : pebsh = 0
            }  else if(_fuel.type === "Diesel") {
                _fuel.pebshf ? pebsh += _fuel.pebshf : pebsh = 0
            }
        }

        if (pebsh < 1){
            let defaultEmission = this.cultivationDefaultEmission(feedstock)
            emission += pesoc + defaultEmission
        } else {
            emission += pesoc + pesm + pebsh + pebb;
        }

        return emission;
    }

    //Calculate leakage emission
    public leakageEmission (leakage: LeakageDto){
        let emission = 0;
        let pp = leakage.residue;
        let fuel = leakage.fuel;
        let lebr = 0;
        let lemeoh = 0;
        let leff = 0;

        for (let _pp of pp){
            lebr += _pp.brpjn * _pp.ncvn;
        }

        lebr = leakage.efco2*lebr

        for (let _fuel of fuel){
            if (_fuel.type === "Methanol"){
                lemeoh = _fuel.fuelConsumption * _fuel.efmeoh;
            } else {
                leff += leakage.ncvbf * _fuel.efijx;
            }
        }

        leff = this.bfy * leff;

        emission += lebr + lemeoh - leff;

        return emission;
    }
}
