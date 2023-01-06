import { Injectable } from '@nestjs/common';
import { BaselineDto } from './dto/baseline.dto';
import { ProjectDto } from './dto/project.dto';
import { ResponseDto } from './dto/response.dto';
import { CdmAmsIiiBnReq } from './message/cdm-ams-iii-bn-req';
import { CdmAmsIiiBnRes } from './message/cdm-ams-iii-bn-res';

@Injectable()
export class CdmAmsIiiBnService {
    public AMSIIIBNEmission(req: CdmAmsIiiBnReq){
        let response: CdmAmsIiiBnRes = new CdmAmsIiiBnRes();
        let responseArray = new Array();
    
        for (let arr in req.baseline){
            console.log(arr)
    
          let baseResponse = new ResponseDto();
          baseResponse.year = req.baseline[arr].year;
          let secbl = this.baselineEmission(req.baseline[arr])
          let project = this.projectEmission(req.project[arr])
          let secpr = project.secpk;
          let efco2 = project.emissions;
          let pk = project.pk;
          let avdk = project.avdk;
          let baselineEmission = 0; let projectEmission = 0;
          let er = 0;

          for (let ele in secbl){
            baselineEmission += pk[ele] * avdk[ele]*efco2[ele]*(secbl[ele]/secpr[ele])
            projectEmission += pk[ele] * avdk[ele]*efco2[ele]
            // er += pk[ele] * avdk[ele] * efco2[ele]* ((secbl[ele]/secpr[ele])-1)
          }
          baseResponse.baseLineEmission = baselineEmission
          baseResponse.projectEmission = projectEmission
          baseResponse.emissionReduction = baseResponse.baseLineEmission - baseResponse.projectEmission

        console.log(baseResponse)
    
          responseArray.push(baseResponse);
        }
        response.response = responseArray;
        response.metaData = req
        return response;
    }

    // calculate baseline emission
    public baselineEmission(baseline: BaselineDto) {
        let emissions = new Array();
        let route = baseline.route;
        let secFossil = 0;
        let secElec = 0;

        for (let _route of route){
            for (let vehicle of _route.vehicle){
                for (let fuel of vehicle.fuel){
                    if (fuel.type === "Electricity"){
                        secElec = (fuel.ecConsumption * 3.6) / (1 - fuel.tdlgrid)
                        console.log("secElec", secElec, fuel.ecConsumption, fuel.tdlgrid)
                    }
                    else {
                        secFossil += fuel.fuelConsumption * fuel.ncv
                        console.log("secFossil", secFossil)
                    }
                }
            }
            emissions.push((secFossil + secElec) / _route.pk)
        }
        console.log("emissions",  emissions)

        return emissions;

    }

    // calculate project emission
    public projectEmission(project: ProjectDto) {
        let emissions = new Array();
        let secpk = new Array();
        let pk = new Array();
        let avdk = new Array();
        let route = project.route;
        let efFossil = 0;
        let efElec = 0;
        let secElec = 0;
        let secFossil = 0;
        
        for (let _route of route){
            for (let vehicle of _route.vehicle){
                for (let fuel of vehicle.fuel){
                    if (fuel.type === "Electricity"){
                        efElec = (fuel.ecConsumption * fuel.efkgrid) / (1 - fuel.tdlgrid)
                        secElec = (fuel.ecConsumption * 3.6) / (1 - fuel.tdlgrid)
                    }
                    else {
                        efFossil += fuel.fuelConsumption * fuel.ncv * fuel.efco2;
                        secFossil += fuel.fuelConsumption * fuel.ncv 
                    }
                }
            }
            emissions.push(((efElec + efFossil)/ (_route.p * _route.avdk)))
            secpk.push((secFossil + secElec) / (_route.p * _route.avdk))
            pk.push(_route.p)
            avdk.push(_route.avdk)
        }

        console.log(emissions, secpk, pk, avdk)

        return {
            emissions: emissions,
            secpk: secpk,
            pk: pk,
            avdk: avdk
        };
    }
}
