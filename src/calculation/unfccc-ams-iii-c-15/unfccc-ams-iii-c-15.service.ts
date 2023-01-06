import { Injectable } from '@nestjs/common';
import { VehicleTypeEnum } from '../enum/vehicle-type.enum';
import { ResponseDto } from '../icat-tpm-2020/dto/response.dto';
import { BaseLineEmissionDto } from './dto/baselineEmission.dto';
import { ProjectEmissionDto } from './dto/projectEmission.dto';
import { UnfcccAmsIIIC15ReqMsg } from './message/unfccc-ams-iii-c-15-req-msg';
import { UnfcccAmsIIIC15ResponseMsg } from './message/unfccc-ams-iii-c-15-res-msg';

@Injectable()
export class UnfcccAmsIiiC15Service {

    public ghgEmission(req: UnfcccAmsIIIC15ReqMsg) {

        let response = new UnfcccAmsIIIC15ResponseMsg();
        let responseArray = new Array();


        // let baseResponse = new ResponseDto();

        for (let num in req.baseline) {
            let baseResponse = new ResponseDto();

            let baseLineEmission = this.baselineEmission(req.baseline[num], req.project[num]);
            let projectEmission = this.projectEmission(req.project[num]);

            baseResponse.year = req.baseline[num].year;
            baseResponse.baseLineEmission = baseLineEmission;
            baseResponse.projectEmission = projectEmission;
            baseResponse.emissionReduction = baseLineEmission - projectEmission;

            responseArray.push(baseResponse);

        }

        response.response = responseArray;
        console.log(response)
        return response;
    }

    public baselineEmission(baseline: BaseLineEmissionDto, project: ProjectEmissionDto) {
        let unitConversion = 1000000;
        let emission = 0;
        for (let num in baseline.vehicle) {
            for (let pro of project.vehicle) {

                if (baseline.vehicle[num].vehicleName == pro.vehicleName) {
                    let IR = baseline.vehicle[num].ir;

                    if (IR === 0) { IR = 0.99; }

                    let emissioFactor = baseline.vehicle[num].sfc * baseline.vehicle[num].fuel.ncv * baseline.vehicle[num].fuel.ef * IR;


                    if (baseline.vehicle[num].vehicleType === VehicleTypeEnum.fuel_vehicle) {

                        let baseEmission = emissioFactor * baseline.distance * baseline.vehicle[num].n / unitConversion;
                        emission += baseEmission;
                    }
                    else if (baseline.vehicle[num].vehicleType === VehicleTypeEnum.electric_vehicle) {
                        let baseEmission = emissioFactor * pro.fuel.fc / (pro.sfc * unitConversion);
                        emission += baseEmission;
                    }
                }

            }

        }

        return emission;

    }

    public projectEmission(project: ProjectEmissionDto) {

        let projectEmission = 0;
        let emissioFactor = 0;


        for (let num in project.vehicle) {
            let fuel = 0
            let fuel_1 = (project.vehicle[num].sfc * project.vehicle[num].fuel.ncv * project.vehicle[num].fuel.ef / 1000000);
            if (fuel_1 > 0) {
                fuel = fuel_1;
            }
            else fuel = 0;

            emissioFactor = (project.vehicle[num].sfc * project.vehicle[num].fuel.ef / (1 - (project.tdl / 100)) * 1000) + fuel;
            console.log("emissioFactor " + emissioFactor)
            let emission = emissioFactor * project.distance * project.vehicle[num].n;
            projectEmission += emission;
            // if (project.vehicle[num].vehicleType === VehicleTypeEnum.electric_vehicle) {
            //     let emission = emissioFactor * project.vehicle[num].fuel.fc / project.vehicle[num].sfc;
            //     projectEmission += emission;
            // }
            // else {
            //     let emission = emissioFactor * project.distance * project.vehicle[num].n;
            //     projectEmission += emission;
            // }
        }
        return projectEmission / 1000000;
    }

}
