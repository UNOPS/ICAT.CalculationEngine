import { Injectable } from '@nestjs/common';
import { VehicleTypeEnum } from '../enum/vehicle-type.enum';
import { ResponseDto } from '../icat-tpm-2020/dto/response.dto';
import { VehicleDto } from './dto/vehicle.dto';
import { UnfcccAmsIIISV4RequestMsg } from './message/unfccc-ams-iii-s-v-4-req-msg';

@Injectable()
export class UnfcccAmsIIISV4Service {

    public ghgEmission(req: UnfcccAmsIIISV4RequestMsg) {


        var responseArray = new Array();

        for (let arr in req.baseline) {
            let projectEmission = 0;
            let baseLineEmission = 0;

            var baseResponse = new ResponseDto();

            for (let num in req.baseline[arr].vehicle) {
                let baseline = this.baselineEmission(req.baseline[arr].vehicle[num], req.project[arr].vehicle[num]);
                baseLineEmission += baseline;
            }

            for (let num in req.project[arr].vehicle) {
                let emission = this.projectEmission(req.project[arr].vehicle[num]);
                projectEmission += emission;
            }

            baseResponse.year = req.baseline[arr].year;
            // baseResponse.year=2017;
            baseResponse.projectEmission = parseFloat(Number(projectEmission).toFixed(2));
            baseResponse.baseLineEmission = parseFloat(Number(baseLineEmission).toFixed(2));
            baseResponse.leakegeEmission = null;
            baseResponse.emissionReduction = parseFloat(Number(baseLineEmission - projectEmission).toFixed(2));


            responseArray.push(baseResponse);


        }

        return responseArray;
    }

    public baselineEmission(baselineVehicle: VehicleDto, projectVehicle: VehicleDto) {
        let baseLineDP = baselineVehicle.dp; 
        let projectDP = projectVehicle.dp;
        let bsd=baselineVehicle.d;
        if (baseLineDP ===0 ) {
            baseLineDP = baselineVehicle.d / baselineVehicle.p;
        }
        if (projectDP=== 0) {
            projectDP = projectVehicle.d / projectVehicle.p;
        }
        if(bsd==0){
            bsd=baseLineDP*baselineVehicle.p;
        }

        return bsd* baselineVehicle.n * baselineVehicle.fuel.ncv * baselineVehicle.fuel.ef * projectVehicle.p * projectDP / (baselineVehicle.p * baseLineDP);
        // return  baselineVehicle.n * baselineVehicle.fuel.ncv * baselineVehicle.fuel.ef * projectVehicle.p * projectDP ;
    }

    public projectEmission(vehicle: VehicleDto) {

        if (vehicle.vehicleType === VehicleTypeEnum.fuel_vehicle) {
            if (vehicle.fuel.fc > 0) {
                return vehicle.fuel.fc * vehicle.fuel.ncv * vehicle.fuel.ef;
            }
            else {
                return vehicle.d * vehicle.n * vehicle.fuel.ncv * vehicle.fuel.ef;
                
            }

        }
        else if (vehicle.vehicleType === VehicleTypeEnum.electric_vehicle) {
            if (vehicle.fuel.fc > 0) {
                return vehicle.fuel.fc * vehicle.fuel.ef
                
            }
            else {
                return vehicle.d * vehicle.n * vehicle.fuel.ef;
            }

        }
    }

}
