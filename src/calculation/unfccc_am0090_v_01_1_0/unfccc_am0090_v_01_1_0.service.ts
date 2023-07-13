import { Injectable } from '@nestjs/common';
import { Console } from 'console';
import { baselineDto } from './dto/baseline.dto';
import { projectDto } from './dto/project.dto';
import { UnfcccAm0090V0110ReqMsg } from './message/unfccc_am0090_v_01_1_0_req_msg';
import { UnfcccAm0090V0110ResMsg } from './message/unfccc_am0090_v_01_1_0_res_msg';

@Injectable()
export class UnfcccAm0090V0110Service {


     public ICATM2(req: UnfcccAm0090V0110ReqMsg) {

          console.log("reqpull===", req)

          var responseArray = new Array();

          for (let num in req.baseline) {

               var response = new UnfcccAm0090V0110ResMsg();

               response.year = req.baseline[num].year;

               response.baselineEmission = this.baselineEmission(req.baseline[num])

               response.projectEmission = this.projectEmission(req.project[num])

               response.emissionReduction = response.baselineEmission - response.projectEmission;


               responseArray.push(response);
          }
          return responseArray;
     }



     public baselineEmission(baseline: baselineDto) {

          let Efbl = 0;

          if (baseline.cdefault) {
               Efbl = baseline.cdefault;
          }

          else {

               Efbl = this.efblHistorical(baseline)
          }

          console.log("EFBL " + Efbl);
          let BEy = baseline.ty * baseline.ad * Efbl * 0.000001;
          console.log("BE " + BEy)

          return BEy;
     }

     public efblHistorical(baseline: baselineDto) {
          let Efbl = 0;
          let frtbl = 0;
          for (let num in baseline.vehicle) {

           //    for (let f in baseline.vehicle[num].fuel) {

                    let efbl_historic: number;
                    if (baseline.frtbl) {
                         frtbl = baseline.frtbl;
                    } else {
                         frtbl = (baseline.tx * baseline.ad) / ((baseline.tx * baseline.ad) + (baseline.trtx * baseline.rtdx));
                         console.log("FRTBLv " + frtbl);

                    }


                    efbl_historic = baseline.vehicle[num].fuel.fcblix * baseline.vehicle[num].fuel.ncv * baseline.vehicle[num].fuel.efco2 * frtbl;//*1000
                    Efbl += efbl_historic;

             //  }

          }

          return Efbl / (baseline.tx * baseline.ad)

     }

     public projectEmission(project: projectDto) {

          let emissionfossilfuel: number;
          let emissionelectricity: number;
          let factornonemptyreturn: number;
          let emissiontranspotationcargo: number;
          let projectemission: number;


          emissionfossilfuel = this.emissionFossilFuel(project);
          // console.log("emissionfossilfuel=====", emissionfossilfuel)
          emissionelectricity = this.emissionElectricity(project);
          // console.log("emissionelectricity=====", emissionelectricity)

          factornonemptyreturn = this.nonemptyReturns(project);
          // console.log("factornonemptyreturn=====", factornonemptyreturn)

          emissiontranspotationcargo = this.emissionTanspotationCargo(project);
          // console.log("emissiontranspotationcargo=====", emissiontranspotationcargo)



          projectemission = (emissionfossilfuel + emissionelectricity) * factornonemptyreturn + emissiontranspotationcargo;



          console.log("PE==== ", projectemission)
          return projectemission;
     }





     public emissionFossilFuel(project: projectDto) {

          let pefcjy: number;
          let coefiy: number;
          let pefcjyt = 0;


          for (let num in project.vehicle) {


               if (project.vehicle[num].type == "ships" || project.vehicle[num].type == "barges" || project.vehicle[num].type == "trains") {
                    console.log("sbt")

                  //  for (let f in project.vehicle[num].fuel) {
                         console.log("oooo===",project.vehicle[num].fuel)

                          if(project.vehicle[num].fuel.type !== "Electricity"){

                         if (project.vehicle[num].fuel.coefiy > 0) {
                               console.log("tttttt")
                              coefiy = project.vehicle[num].fuel.coefiy;

                              pefcjy = coefiy * project.vehicle[num].fuel.fcijy;//*1000

                              console.log("pefcjy==",pefcjy)
                              
                              pefcjyt += pefcjy;

                              console.log("pefcjyt==",pefcjyt)


                         }



                      else  if (project.vehicle[num].fuel.efco2 && project.vehicle[num].fuel.ncv) {
                              console.log("ncv")

                              coefiy = project.vehicle[num].fuel.ncv * project.vehicle[num].fuel.efco2;//devided by 1000000
                              console.log("coef==", coefiy)

                              pefcjy = coefiy * project.vehicle[num].fuel.fcijy;//*1000
                              console.log("pp==", pefcjy)
                              pefcjyt += pefcjy;

                         }

                         else {
                              console.log("oooopppppps")
                              if (project.vehicle[num].fuel.piy) {

                                   coefiy = project.vehicle[num].fuel.wciy * project.vehicle[num].fuel.piy * 44 / 12;

                                   pefcjy = coefiy * project.vehicle[num].fuel.fcijy;

                                   pefcjyt += pefcjy;
                                   console.log("oooopppppps2",pefcjyt)



                              }
                              else {

                                   coefiy = project.vehicle[num].fuel.wciy * 44 / 12;

                                   pefcjy = coefiy * project.vehicle[num].fuel.fcijy;


                                   pefcjyt += pefcjy;



                              }

                         }


                    }else{
                         return 0;
                    }
                   // }
               }

          } console.log("Emission fossil fuel " + pefcjyt)

          return pefcjyt;


     }


     public emissionElectricity(project: projectDto) {
          let peecy = 0;
          let peecyt = 0;

          for (let num in project.vehicle) {
             //  for (let f in project.vehicle[num].fuel) {
                    if (project.vehicle[num].fuel.type == "Electricity") {


                         peecy = project.vehicle[num].fuel.fcijy * project.vehicle[num].fuel.efefjy * (1 + project.vehicle[num].fuel.tdljy / 100);
                         peecyt += peecy;

                    }
               //}



          }
          console.log("Emission Electricity " + peecyt)


          return peecyt;
     }

     public nonemptyReturns(project: projectDto) {
          let frtpjy: number;

          frtpjy = project.ty / (project.ty + project.trty);

          console.log("Non Empty returns " + frtpjy);

          return frtpjy;

     }



     public emissionTanspotationCargo(project: projectDto) {
          let pefcry: number;
          let coefiy: number;
          let pefcryt = 0;

          console.log("-----------emissionTanspotationCargo------------")
          for (let num in project.vehicle) {

               console.log("-----------emissionTanspotationCargo-11-----------",project.vehicle[num])

               if (project.vehicle[num].type == "trucks") {
                    console.log("jjjjj")

                   // for (let f in project.vehicle[num].fuel) {


                         if (project.vehicle[num].fuel.efco2 && project.vehicle[num].fuel.ncv) {

                              coefiy = project.vehicle[num].fuel.ncv * project.vehicle[num].fuel.efco2 / 1000000;

                              pefcry = coefiy * project.vehicle[num].fuel.fcijy * 1000;

                              pefcryt += pefcry;



                         }


                         else {
                              if (project.vehicle[num].fuel.piy) {

                                   coefiy = project.vehicle[num].fuel.wciy * project.vehicle[num].fuel.piy * 44 / 12;

                                   pefcry = coefiy * project.vehicle[num].fuel.fcijy;

                                   pefcryt += pefcry;


                              }
                              else {

                                   coefiy = project.vehicle[num].fuel.wciy * 44 / 12;

                                   pefcry = coefiy * project.vehicle[num].fuel.fcijy;



                                   pefcryt += pefcry;

                              }


                         }


                   // }
                    console.log("Emission transport cargo " + pefcryt);
                    return pefcryt;

               }else{
                    return 0;
               }
          }

     }

     //MAC-Calculations
     public pmtCalculation(discount_rate: number, project_life: number, totalInvestment: number) {
          let presentage = 100;
          if (project_life == 0) { return 0; }

          else {
               var presentValueInterstFector = Math.pow((1 + (discount_rate / presentage)), project_life);
               var pmt = (discount_rate / presentage) * totalInvestment * (presentValueInterstFector) / (presentValueInterstFector - 1);

               console.log("LevInvest " + pmt);

               return pmt;

          }


     }

     public annual_OM(investment: number, anualOandM: number) {
          let presentage = 1000000;
          let annualoandm = investment * anualOandM * presentage / 100;
          console.log("AnnualOandM " + annualoandm);
          return annualoandm;


     }

     public reference_annual_OM(anualOandM: number, investmentInOneTruck: number, dailyActivity: number, occupancy: number) {

          let numOfTrucks = dailyActivity / occupancy;
          let anualoandm = anualOandM * investmentInOneTruck * numOfTrucks / 100;
          console.log("Ref Annual O&M " + anualoandm);
          return anualoandm;
     }


     public annualFuelCost(dailyActivity: number, specificDieselConsumption: number, oneUsGalon: number, OneMile: number, dieselPrice: number) {

          let annualfuelcost = dieselPrice * dailyActivity * specificDieselConsumption * oneUsGalon * 365 / OneMile;

          console.log("Anual Fuel Cost " + annualfuelcost)

          return annualfuelcost;

     }

     public reference_annualFuelCost(dailyActivity: number, dieselConsumption: number, dieselPrice: number) {

          let annualfuelcost = dailyActivity * 365 / dieselConsumption;
          console.log("Ref  Anual Fuel Cost " + annualfuelcost)

          return annualfuelcost;

     }

     public totalAnualCost(LevInvestment: number, AnualOAndM: number, AnnuaFuelCost: number) {

          let totalAnualCost = LevInvestment + AnualOAndM + AnnuaFuelCost;

          console.log("TotalAnualcost " + totalAnualCost);

          return totalAnualCost;

     }


}