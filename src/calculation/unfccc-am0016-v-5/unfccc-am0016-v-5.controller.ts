import { Body, Controller, Post } from '@nestjs/common';
import { R } from '@nestjsx/crud/lib/crud';
import { VehicleTypeEnum } from './enum/vehicle-type.enum';
import { UnfcccAm0016V5ReqMsg } from './message/unfccc-am0016-v-5-req-msg';
import { UnfcccAm0016V5ResMsg } from './message/unfccc-am0016-v-5-res-msg';
import { UnfcccAm0016V5Service } from './unfccc-am0016-v-5.service';

@Controller('unfccc-am0016-v-5')
export class UnfcccAm0016V5Controller {

    constructor(public service: UnfcccAm0016V5Service) { }


    @Post('/ghg')
    private ICATM(@Body() req: UnfcccAm0016V5ReqMsg) {

        console.log("iiii====",req)

        var response = new UnfcccAm0016V5ResMsg();
         var responseArray = new Array();

         let leakageloadfactorbusesandtaxis = 0;

        for(let num in req.baseline){
            response.baselineEmission = this.service.baselineEmission(req.baseline[num]);
           // let directprojectEmissionFromFuel = this.service.directprojectEmissionFromFuel(req.project[num]);
          //  let directprojectEmissionFromElectricity = this.service.directprojectEmissionFromElectricity(req.project[num]);
         ///   let indiectProjectEmission = this.service.indiectProjectEmission(req.project[num]);

          //  response.projectEmission = directprojectEmissionFromFuel+directprojectEmissionFromElectricity+indiectProjectEmission;


            // for (let m in req.leakage[num].vehicle) {//buses and taxis
            //        if (req.leakage[num].vehicle[m].type === "bus" || req.leakage[num].vehicle[m].type === "taxi") { 
            //         let leakageloadfactor = this.service.leakageloadfactorbusesandtaxis(req.leakage[num].vehicle[m]);
            //         console.log("leakageloadfactor==",leakageloadfactor)
            //         leakageloadfactorbusesandtaxis += leakageloadfactor;
            //         console.log("leakageloadfactorbusesandtaxis==",leakageloadfactorbusesandtaxis)


            //        }
        
            //      }
        // let leakageduetoreducedcongestion = this.service.leakageduetoreducedcongestion(req.leakage[0]);//car and taxis


            responseArray.push(response);

                }


        return responseArray;
    }

}


