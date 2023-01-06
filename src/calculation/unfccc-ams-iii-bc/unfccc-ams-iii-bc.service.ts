import { Injectable } from '@nestjs/common';
import { VehicleTypeEnum } from '../enum/vehicle-type.enum';
import { baselineDto } from './dto/baseline.dto';
import { MacFuelGeneraInputlDto } from './dto/mac-fuel-general-input.dto';
import { MacFuelProjectDto } from './dto/mac-fuel-project.dto';
import { MacFuelReferenceDto } from './dto/mac-fuel-reference.dto';
import { MacVehicleDto } from './dto/mac-vahicle.dto';
import { projectDto } from './dto/project.dto';
import { vehicleDto } from './dto/vehicle.dto';
import { UnfccAmsIIIBcReqMsg } from './message/unfccc-ams-iii-bc-req-msg';
import { UnfcccAmsIIIBcResMsg } from './message/unfccc-ams-iii-bc-res-msg';

@Injectable()
export class UnfcccAmsIiiBcService {


///---------------
public ICATM1(req: UnfccAmsIIIBcReqMsg) {

    var response = new UnfcccAmsIIIBcResMsg();
    for (let num in req.baseline) {
        

    var responseArray = new Array();

    let baselineEmissionHeavy = this.baselineEmissionHeavy(req.baseline[num]);

    let baselineEmissionOther = this.baselineEmissionOther(req.baseline[num]);

    let projectEmissionHeay = this.projectEmissionHeavy(req.project[num]);

    let projectEmissionOther = this.projectEmissionOther(req.project[num]);

    response.year = req.baseline[num].year;

    response.baselineEmission = baselineEmissionHeavy + baselineEmissionOther;

    response.projectEmission =  projectEmissionHeay + projectEmissionOther;

    response.leakegeEmission =  0;

    response.emissionReduction = response.baselineEmission -  response.projectEmission;

    responseArray.push(response);

   //console.log("calengine-response1--",responseArray)

    
    }

    return responseArray;

}
///------------

    public baselineEmissionHeavy(baseline: baselineDto) {
        console.log("baselineEmissionHeavy")

        let BEyt: number = 0;
        let beftkmixy:number=0;
        let BEy: number;
        let altkmixy:number;
        
        for (let num in baseline.vehicle) {

            if(baseline.vehicle[num].type == VehicleTypeEnum.heavy_duty){

                if(baseline.vehicle[num].altkmixy>0){
                    altkmixy = baseline.vehicle[num].altkmixy;
                    console.log("uuuu==",altkmixy)
                }
                else{
    
                    console.log("totaldistancetravel",baseline.vehicle[num].totaldistancetravel)
                    altkmixy = baseline.vehicle[num].avgweightbyvehicle*baseline.vehicle[num].totaldistancetravel;
                    console.log("xxxxxxxxx")
                }

            if(baseline.vehicle[num].beftkmixy>0){
                beftkmixy = baseline.vehicle[num].beftkmixy;
                console.log("iiiii===",beftkmixy)

            }
            else{

                beftkmixy = baseline.vehicle[num].sfcblixy * baseline.vehicle[num].fuel.ncv *
                            baseline.vehicle[num].fuel.efco2xy / baseline.vehicle[num].awblixy;
                            
            }

       

        

            BEy = beftkmixy * altkmixy *  0.000001;
            console.log("baselineHeay--",BEy)

            BEyt += BEy;
            
        }
        }
        
        return BEyt;
    }

    public baselineEmissionOther(baseline: baselineDto) {
        console.log("baselineEmissionLight")

        let BEyt: number = 0;
        let BEy: number;
        let befkmixy:number=0;
        let alkmixy:number;
        for (let num in baseline.vehicle) {

            if(baseline.vehicle[num].type == VehicleTypeEnum.light_duty){

                if(baseline.vehicle[num].altkmixy){
                    alkmixy = baseline.vehicle[num].altkmixy;
                   // console.log("yyyyyyy")

                }
                else{
    
                    alkmixy = baseline.vehicle[num].avgweightbyvehicle*baseline.vehicle[num].totaldistancetravel;
                   // console.log("yyyyyyy")

                }
           
                if(baseline.vehicle[num].beftkmixy>0){
                    befkmixy = baseline.vehicle[num].beftkmixy;
                    //console.log("yyyyyyy")


                }
                else{

                    befkmixy = baseline.vehicle[num].sfcblixy * baseline.vehicle[num].fuel.ncv * baseline.vehicle[num].fuel.efco2xy;
                    //console.log("yyyyyyy")

                }

            BEy = befkmixy * alkmixy * 0.000001;
            console.log("baselinelight--",BEy)

            BEyt += BEy;

        }
    }

        return BEyt;

    }


    public projectEmissionHeavy(project: projectDto) {

        let PEyt: number = 0;
        let PEy: number;
        let beftkmixy:number=0;
        let altkmixy:number=0;
        for (let num in project.vehicle) {
            
            if(project.vehicle[num].type == VehicleTypeEnum.heavy_duty){

                if(project.vehicle[num].altkmixy){
                    altkmixy = project.vehicle[num].altkmixy;
                }
                else{
    
                    altkmixy = project.vehicle[num].avgweightbyvehicle*project.vehicle[num].totaldistancetravel;
                }

                if(project.vehicle[num].beftkmixy>0){
                    beftkmixy = project.vehicle[num].beftkmixy;
                    console.log("hhhhhh")

                }
                else{

                    beftkmixy = project.vehicle[num].sfcblixy * project.vehicle[num].fuel.ncv *
                                 project.vehicle[num].fuel.efco2xy / project.vehicle[num].awblixy;
                }

           
            PEy =  beftkmixy * altkmixy * 0.000001;

            PEyt += PEy;
            //  console.log(BEy);

        }
    }
        // console.log(BEyt);
        return PEyt;


    }

    public projectEmissionOther(project: projectDto) {

        let PEyt: number = 0;
        let PEy: number;
        let befkmixy:number=0;
        let alkmixy:number;
        for (let num in project.vehicle) {

            if(project.vehicle[num].type == VehicleTypeEnum.light_duty){

                
                if(project.vehicle[num].altkmixy){
                    alkmixy = project.vehicle[num].altkmixy;
                }
                else{
    
                    alkmixy = project.vehicle[num].avgweightbyvehicle*project.vehicle[num].totaldistancetravel;
                }
           
                if(project.vehicle[num].beftkmixy>0){
                    befkmixy = project.vehicle[num].beftkmixy;

                }
                else{

                    befkmixy = project.vehicle[num].sfcblixy * project.vehicle[num].fuel.ncv * project.vehicle[num].fuel.efco2xy;
                }
            

            PEy = befkmixy *alkmixy * 0.000001;
            PEyt += PEy;

        }
    }

        return PEyt;

    }


    //Mac-Calculations
    public projecttotalInvestment(totalinvestmet: MacFuelGeneraInputlDto) {

        let projecttotalinvestment = totalinvestmet.annualActivity * totalinvestmet.investmentPerTestCenter;

        return projecttotalinvestment;

    }

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

    public annual_OM(annualom:MacFuelGeneraInputlDto){

        let annualoandm = annualom.annualActivity*annualom.investmentPerTestCenter*annualom.annualOAndMOfTestCenter;
        
        return annualoandm;


    }

    public annualFuelCost(vehicle:MacFuelProjectDto){

        for (let num in vehicle.vehicle) {

        let tafc:number = 0;
        let afc:number;

        let annualTestFailuresVehicles:number;
        let totAnnualTravelOfAboveVehicles:number;
        let annualFuelConsumption:number;
        
        let tspecificFuelConsumption:number;


        annualTestFailuresVehicles = this.annualTestFailuresVehicles(vehicle.vehicle[num]);

        totAnnualTravelOfAboveVehicles = annualTestFailuresVehicles*vehicle.vehicle[num].novehicles/1000000;

        tspecificFuelConsumption = vehicle.vehicle[num].fuel.SpecificFuelConsumption*(1+vehicle.vehicle[num].fuel.fuelSavingMaintenance/100);

        annualFuelConsumption = totAnnualTravelOfAboveVehicles/tspecificFuelConsumption;

        afc = annualFuelConsumption*vehicle.vehicle[num].fuel.price;

        tafc += afc;

        return tafc;
    }
    }

    public annualTestFailuresVehicles(vehicle:MacVehicleDto){
       
        let atfr :number;
        if(vehicle.usedInCalculations === 1){
            atfr =  vehicle.testFailRate*vehicle.totVehicles*vehicle.shareOfVehicles*vehicle.percentageOfFuelVehicles/1000000;

        }
        else{
         atfr = 0;

        }
    return atfr;

    

    
    }

    public referenceAnnualFuelCost(vehicle:MacFuelReferenceDto){

        for (let num in vehicle.vehicle) {

            let tafc:number = 0;
            let afc:number;
    
            let annualTestFailuresVehicles:number;
            let totAnnualTravelOfAboveVehicles:number;
            let annualFuelConsumption:number;
            
            let tspecificFuelConsumption:number;
    
    
            annualTestFailuresVehicles = this.annualTestFailuresVehicles(vehicle.vehicle[num]);
    
            totAnnualTravelOfAboveVehicles = annualTestFailuresVehicles*vehicle.vehicle[num].novehicles/1000000;
    
           // tspecificFuelConsumption = vehicle.vehicle[num].fuel.SpecificFuelConsumption*(1+vehicle.vehicle[num].fuel.fuelSavingMaintenance/100);
    
            annualFuelConsumption = totAnnualTravelOfAboveVehicles/vehicle.vehicle[num].fuel.SpecificFuelConsumption;
    
            afc = annualFuelConsumption*vehicle.vehicle[num].fuel.price;
    
            tafc += afc;
    
            return tafc;
        }


    }

}
