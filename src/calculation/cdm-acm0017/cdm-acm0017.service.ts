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

    public ACM0017Emission(req: CdmAcm0017ReqMsg){
        console.log("ACM0017Emission")
        let response: CdmAcm0017ResMsg = new CdmAcm0017ResMsg();
        let responseArray = new Array();
    
        for (let arr in req.baseline){
            console.log(arr)
    
          let baseResponse = new ResponseDto();
          baseResponse.year = req.baseline[arr].year;
          baseResponse.baseLineEmission = this.baselineEmission(req.baseline[arr])
          baseResponse.projectEmission = this.projectEmission(req.project[arr])
          baseResponse.leakageEmission = this.leakageEmission(req.leakage[arr])
          baseResponse.emissionReduction = baseResponse.baseLineEmission - baseResponse.projectEmission -baseResponse.leakageEmission

    
          responseArray.push(baseResponse);
        }
        response.response = responseArray;
        response.metaData = req
        return response;
    }

    // calculate baseline emission
    public baselineEmission(baseline: BaselineDto) {
        console.log(baseline)
        let pp = baseline.powerplant;
        let fuels = pp.fuel;
        let emission = 0;
        let min1 = 0;
        let min2 = 0;
        let numerator = 0;
        let denominator = 0;
        let efco2 = 0;
        let fossilFuels = ["Diesel", "Petrol"];

        min1 = pp.pbf - pp.pbfsite;

        for (let _fuel of fuels) {
            if (fossilFuels.includes(_fuel.type)) {
                efco2 = _fuel.efco2;
            } else {
                min2 = _fuel.fpj * _fuel.cbf
                numerator = _fuel.cbf * ((_fuel.fpj - _fuel.freg) / _fuel.fpj)
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
        let powerPlant = project.powerplant;

        emission = this.biomassEmission(powerPlant) + (powerPlant.af1 * this.methanolEmission(powerPlant.prfuel))

        return emission;
    }

    public biomassEmission(pp) {
        let emission = 0;
        let fsEmission = 0;

        for (let _fs of pp.feedstock){
            fsEmission += _fs.as * _fs.efs
        }

        let pebc = this.socEmission(pp.stratum, pp.t) + fsEmission;

        emission = pp.af1 * (pp.pebp + pp.pebt + (pp.af2 * pebc))

        return emission;
    }

    public socEmission(stratum, t){
        let diffSOC = 0;

        for (let _st of stratum){
            diffSOC += 1.21 * _st.asoc * _st.socref * ((_st.flub * _st.fmgb * _st.finb) -(_st.flup * _st.fmgp * _st.finp))
        }

        let emission = Math.max((44/12) * (1.179/t) * diffSOC, 0);

        return emission;
    }

    public methanolEmission(fuel){
        let emission = fuel.fuelConsumption * fuel.efcmeoh * (44/12)

        return emission;
    }

    //Calculate leakage emission
    public leakageEmission(leakage: LeakageDto) {
        console.log(leakage)
        let emission = 0;
        let fuel = leakage.fuel;
        let lemeoh = 0;
        let leff = 0;

        for (let _fuel of fuel) {
            console.log(_fuel)
            if (_fuel.type === "Methanol") {
                lemeoh = _fuel.fuelConsumption * _fuel.efmeoh;
            } else {
                leff += leakage.ncvbf * _fuel.efijx;
            }
        }
        console.log(this.bfy, leakage.ncvbf, leff)

        let leffy = this.bfy * leff;

        emission += leakage.lebr + lemeoh - leffy;
        console.log(emission)

        return emission;
    }
}
