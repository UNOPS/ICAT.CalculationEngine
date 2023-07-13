import { Body, Controller, Post } from '@nestjs/common';
import { VehicleTypeEnum } from '../enum/vehicle-type.enum';
import { JicaTcmMsPV3Service } from './jica-tcm-ms-p-v-3.service';
import { JicaTcmMsPV3ResMsg } from './message/Jica-tcm-ms-p-v-3-res-msg';
import { JicaTcmMsPV3ReqMsg } from './message/Jica-tcm-ms-p-v-3-req-msg';
import { ProjectEmissionTypeEnum } from '../enum/project-emisson-type.enum';
import { ResponseDto } from './dto/responce.dto';

@Controller('calculation')
export class JicaTcmMsPV3Controller {

    constructor(public service: JicaTcmMsPV3Service,
    ) {
    }

    @Post('/jica-tcm-ms-p-v-3')
    public modalShift(@Body() req: JicaTcmMsPV3ReqMsg): JicaTcmMsPV3ResMsg {


        var responseMasege = new JicaTcmMsPV3ResMsg();
        var responceArray = new Array();


        for (let arr in req.baselineEmission) {
            let baseLineEmission = 0;
            let projectEmission = 0;

            let response = new ResponseDto();
            // let emission =0;
            let emission = this.service.baselineEmission(req.projectEmission[arr],req.baselineEmission[arr] );

            baseLineEmission += emission;


            if (req.projectEmission[arr].projectEmissonType === ProjectEmissionTypeEnum.model_shift) {

                if (req.projectEmission[arr].vehicle_type == VehicleTypeEnum.fuel_vehicle) {

                    let emission: number;
                    emission = this.service.projectEmissonForFuel(req.projectEmission[arr]);

                    projectEmission += emission;

                }

                else if (req.projectEmission[arr].vehicle_type == VehicleTypeEnum.electric_vehicle) {

                    let emission: number;
                    if (req.projectEmission[arr].ec === 0) {
                        emission = this.service.projectEmissonForElectricityWithDistance(req.projectEmission[arr].distance, req.projectEmission[arr].sfc, req.projectEmission[arr].ef);
                    }
                    else {
                        emission = this.service.projectEmissonForElectricity(req.projectEmission[arr].ec, req.projectEmission[arr].ef);
                    }
                    projectEmission += emission;
                }
            }

            else if (req.projectEmission[arr].projectEmissonType === ProjectEmissionTypeEnum.traffic_congestion_mitigation) {
                for (let num in req.projectEmission[arr].fc) {
                    let emission: number;
                    emission = this.service.trafficCongestionMitigation(req.projectEmission[arr], req.projectEmission[arr].traficCon[num], req.projectEmission[arr].fc[num])
                    // console.log(emission);
                    projectEmission += emission;
                }
            }

            response.year = req.projectEmission[arr].year;
            response.baseLineEmission = parseFloat(Number(baseLineEmission).toFixed(2));
            response.projectEmission = parseFloat(Number(projectEmission).toFixed(2));
            response.emissionReduction = parseFloat(Number(baseLineEmission - projectEmission).toFixed(2));

            responceArray.push(response);
        }
        responseMasege.metaData = req;
        responseMasege.response = responceArray;
        return responseMasege;
    }
}
