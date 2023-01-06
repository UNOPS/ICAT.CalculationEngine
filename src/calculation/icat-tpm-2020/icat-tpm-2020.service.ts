import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { MethodologyService } from "src/methodology/methodology.service";
import { Repository } from "typeorm";
import { ProjectTypeEnum } from "../enum/project_type.enum";
import { ConsumerPriceService } from "./consumer-price.service.service";
import { BaselineDto } from "./dto/baseline.dto";
import { VehicleDto } from "./dto/vehicle.dto";
import { PppConversionFactor } from "./entity/ppp-conversion-factor.entity";
import { IcatTpm2020request } from "./message/calculation-request-msg";
import { icatCATResponceMsg } from "./message/calculation-response-msg";
import { PPPPriceService } from "./ppp-price-service.service";
// import { PppConversionFactor } from "./entity/ppp-conversion-factor.entity";

@Injectable()
export class IcatTpm2020Service extends TypeOrmCrudService<PppConversionFactor> {

    constructor(

        @InjectRepository(PppConversionFactor) repo,
        @InjectRepository(PppConversionFactor)
        private readonly usersRepository: Repository<PppConversionFactor>,
        public consumerPriceService: ConsumerPriceService,
        public PPPPriceService: PPPPriceService) {
        super(repo);

    }

    public async calculate(req: IcatTpm2020request) {


        let baseLineEmission = 0;
        let ghgImpact = 0;


        if (req.projectType.baseLineApproch > 0) {

            if (req.projectType.baseLineApproch === ProjectTypeEnum.baseLineApproch_A) {
                for (let num in req.baseline.vehicle) {
                    let emission = 0
                    if (req.baseline.fuelUsed > 0) {
                        emission = this.baseLineEmission(req.baseline.fuelUsed, req.baseline.vehicle[num].fuel.fuelShare, req.baseline.vehicle[num].fuel.ef);
                    }

                    baseLineEmission += emission;
                }
            }

            else if (req.projectType.baseLineApproch === ProjectTypeEnum.baseLineApproch_B) {
                for (let num in req.baseline.vehicle) {

                    let emission = this.baseLineEmissoioB(req.baseline.vehicle[num].fuel.used_weight, req.baseline.vehicle[num].fuel.used_liters, req.baseline.vehicle[num].fuel.density, req.baseline.vehicle[num].fuel.ncv, req.baseline.vehicle[num].fuel.ef * 1000);

                    baseLineEmission += emission;

                    //
                }
                // response.baseLineEmission = baseLineEmission;
            }

            else if (req.projectType.baseLineApproch === ProjectTypeEnum.baseLineApproch_C) {
                let fuelEmission = 0;
                let elecEmission = 0;
                for (let num in req.baseline.vehicle) {
                    if ((req.baseline.vehicle[num].fuel.vkt > 0 || req.baseline.vehicle[num].fuel.fc === 0) && req.baseline.vehicle[num].fuel.type != "Electricity") {
                        // console.log('kddddddddddd')
                        let fuelEnergy = this.fuelEnergyWithVKT(req.baseline.vehicle[num].fuel.vkt, req.baseline.vehicle[num].fuel.sfc, req.baseline.vehicle[num].fuel.density, req.baseline.vehicle[num].fuel.ncv, req.baseline.vehicle[num].fuel.ef);
                        fuelEmission += fuelEnergy;
                        // console.log('kddddddddddd',fuelEmission);
                    }

                    else if ((req.baseline.vehicle[num].fuel.vkt === 0 || req.baseline.vehicle[num].fuel.fc > 0) && req.baseline.vehicle[num].fuel.type != "Electricity") {
                        let fuelEnergy = this.fuelEnergyWithFC(req.baseline.vehicle[num].fuel.fc, req.baseline.vehicle[num].fuel.density, req.baseline.vehicle[num].fuel.ncv, req.baseline.vehicle[num].fuel.ef);
                        fuelEmission += fuelEnergy;
                        // console.log(fuelEmission);
                    }
                    else if (req.baseline.vehicle[num].fuel.vkt > 0 && req.baseline.vehicle[num].fuel.type === "Electricity") {
                        console.log(req.baseline.vehicle[num].fuel)
                        let elecEnergy = this.elecEnergy(req.baseline.vehicle[num].fuel.vkt, req.baseline.vehicle[num].fuel.sfc);

                        elecEmission = this.emission(req.baseline.vehicle[num].fuel.ef, elecEnergy);
                        // console.log(elecEmission)
                    }
                    else if (req.baseline.vehicle[num].fuel.vkt === 0 && req.baseline.vehicle[num].fuel.type === "Electricity") {
                        elecEmission = this.eleEmission(req.baseline.vehicle[num].fuel.ef, req.baseline.vehicle[num].fuel.fc);
                    }

                }
                baseLineEmission = fuelEmission + elecEmission;
                console.log(baseLineEmission)
            }
        }


        if (req.projectType.projectApproch > 0) {

            if (req.projectType.projectApproch === ProjectTypeEnum.projectApproch_A) {
                let fuelElasticity = 0;
                if (req.project.fuelMixPriceElasticity != undefined && req.project.fuelMixPriceElasticity != 0) {
                    fuelElasticity = req.project.fuelMixPriceElasticity;
                }
                else {
                    const countriFuelPrice = await this.PPPPriceService.getPPPvalue(req.project.special.countryCode, req.project.special.year);
                    console.log("++++++pppp", fuelElasticity)
                    fuelElasticity = await this.elesticPrice(req.project.special.priceElasticity.mixFuelPrice, req.project.special.priceElasticity.capitalIncome, countriFuelPrice, req.project.special.year);
                }
                console.log("++++++", fuelElasticity)
                let ghgEmission = this.AnticipatedCalculation(fuelElasticity, req.project.fuelMixPriceIncrease, baseLineEmission);

                let fuelUse = this.AnticipatedCalculation(fuelElasticity, req.project.fuelMixPriceIncrease, req.baseline.fuelUsed);

                ghgImpact = ghgEmission;

            }

            else if (req.projectType.projectApproch === ProjectTypeEnum.projectApproch_B) {
                for (let num in req.baseline.vehicle) {
                    let fuelElasticity = 0;
                    if (req.project.fuel[num].priceElasticity != 0) {
                        fuelElasticity = req.project.fuel[num].priceElasticity;
                    }

                    else if (req.project.fuel[num].type != "diesel" || req.project.fuel[num].type != "Diesel") {
                        const countriFuelPrice = await this.PPPPriceService.getPPPvalue(req.project.special.countryCode, req.project.special.year);

                        fuelElasticity = await this.elesticPrice(req.project.fuel[num].fuelPrice, req.project.special.priceElasticity.capitalIncome, countriFuelPrice, req.project.special.year);
                    }

                    else {
                        const countriFuelPrice = await this.PPPPriceService.getPPPvalue(req.project.special.countryCode, req.project.special.year);
                        fuelElasticity = await this.elesticPriceWithdiesel(req.project.fuel[num].fuelPrice, req.project.special.priceElasticity.capitalIncome, countriFuelPrice, req.project.special.year);

                    }

                    let emission = this.baseLineEmissoioB(req.baseline.vehicle[num].fuel.used_weight, req.baseline.vehicle[num].fuel.used_liters, req.baseline.vehicle[num].fuel.density, req.baseline.vehicle[num].fuel.ncv, req.baseline.vehicle[num].fuel.ef);
                    let ghgEmission = this.AnticipatedCalculation(fuelElasticity, req.project.fuel[num].priceIncrease, emission);
                    ghgImpact += ghgEmission * 1000;
                }


            }

            else if (req.projectType.projectApproch === ProjectTypeEnum.projectApproch_C) {

                let pkmWithTrain = 0;
                for (let num in req.baseline.vehicle) {
                    let fuelEmission = 0;

                    if (req.baseline.vehicle[num].fuel.vkt > 0 && req.baseline.vehicle[num].fuel.type != "Electricity") {
                        let fuelEnergy = this.fuelEnergyWithVKT(req.baseline.vehicle[num].fuel.vkt, req.baseline.vehicle[num].fuel.sfc, req.baseline.vehicle[num].fuel.density, req.baseline.vehicle[num].fuel.ncv, req.baseline.vehicle[num].fuel.ef);
                        fuelEmission = fuelEnergy;
                    }

                    else if (req.baseline.vehicle[num].fuel.vkt === 0 && req.baseline.vehicle[num].fuel.type != "Electricity") {
                        let fuelEnergy = this.fuelEnergyWithFC(req.baseline.vehicle[num].fuel.fc, req.baseline.vehicle[num].fuel.density, req.baseline.vehicle[num].fuel.ncv, req.baseline.vehicle[num].fuel.ef);
                        fuelEmission = fuelEnergy;

                    }

                    else if (req.baseline.vehicle[num].fuel.vkt > 0 && req.baseline.vehicle[num].fuel.type === "Electricity") {
                        let elecEnergy = this.elecEnergy(req.baseline.vehicle[num].fuel.vkt, req.baseline.vehicle[num].electricity.sfc);

                        fuelEmission = this.emission(req.baseline.vehicle[num].fuel.ef, elecEnergy);
                    }
                    else if (req.baseline.vehicle[num].fuel.vkt === 0 && req.baseline.vehicle[num].fuel.type === "Electricity") {
                        fuelEmission = this.eleEmission(req.baseline.vehicle[num].fuel.ef, req.baseline.vehicle[num].fuel.fc);
                    }

                    let energy = this.trainPKM(fuelEmission, req.baseline.vehicle[num].fuel.ef, req.baseline.vehicle[num].n);

                    pkmWithTrain += energy;
                }
                //--------------------------------------------------------------------------
                for (let num in req.baseline.vehicle) {
                    for (let pro in req.project.fuel) {
                        if(req.baseline.vehicle[num].fuel.type == req.project.fuel[pro].type){
                            console.log("+++",req.baseline.vehicle[num].vehicleType ,req.project.fuel[pro].type)
                            let crosePriseElasticity = 0;
                            let fuelEmission = 0;
    
    
                            if (req.baseline.vehicle[num].fuel.vkt > 0 && req.baseline.vehicle[num].fuel.type != "Electricity") {
                                let fuelEnergy = this.fuelEnergyWithVKT(req.baseline.vehicle[num].fuel.vkt, req.baseline.vehicle[num].fuel.sfc, req.baseline.vehicle[num].fuel.density, req.baseline.vehicle[num].fuel.ncv, req.baseline.vehicle[num].fuel.ef);
                                fuelEmission = fuelEnergy;
                            }
    
                            else if (req.baseline.vehicle[num].fuel.vkt === 0 && req.baseline.vehicle[num].fuel.type != "Electricity") {
                                let fuelEnergy = this.fuelEnergyWithFC(req.baseline.vehicle[num].fuel.fc, req.baseline.vehicle[num].fuel.density, req.baseline.vehicle[num].fuel.ncv, req.baseline.vehicle[num].fuel.ef);
                                fuelEmission = fuelEnergy;
                            }
    
                            else if (req.baseline.vehicle[num].fuel.vkt > 0 && req.baseline.vehicle[num].fuel.type === "Electricity") {
                                let elecEnergy = this.elecEnergy(req.baseline.vehicle[num].fuel.vkt, req.baseline.vehicle[num].electricity.sfc);
    
                                fuelEmission = this.emission(req.baseline.vehicle[num].fuel.ef, elecEnergy);
                            }
                            else if (req.baseline.vehicle[num].fuel.vkt === 0 && req.baseline.vehicle[num].fuel.type === "Electricity") {
                                fuelEmission = this.eleEmission(req.baseline.vehicle[num].fuel.ef, req.baseline.vehicle[num].fuel.fc);
                            }
    
                            //------------------------------
    
                            if (req.project.fuel[pro].priceElasticity != 0) {
                                crosePriseElasticity = req.project.fuel[pro].priceElasticity;
                            }
                            else {
                                const countriFuelPrice = await this.PPPPriceService.getPPPvalue(req.project.special.countryCode, req.project.special.year);
                                // if(req.project.fuel[pro].type=="Petrol" || req.project.fuel[pro].type=="Gasolin"){
                                    crosePriseElasticity = await this.crossElesticPriceWithdiesel(req.project.fuel[pro].fuelPrice, req.project.special.priceElasticity.capitalIncome, countriFuelPrice, req.project.special.year, req.baseline.vehicle[num].vehicleType);
                                
                                // }
                                // else{
                                    // crosePriseElasticity = await this.elesticPriceWithdiesel(req.project.fuel[pro].fuelPrice, req.project.special.priceElasticity.capitalIncome, countriFuelPrice, req.project.special.year);
                                
                                // }
                                console.log("++++++++++ppp",countriFuelPrice,crosePriseElasticity)
                            }
    
                            let pasengerTransport = this.pkmCalculation(req.baseline.vehicle[num].or, req.baseline.vehicle[num].fuel.vkt);
                           
                            if (req.baseline.vehicle[num].vehicleType != "Train") {
                                pasengerTransport = this.pkmCalculation(req.baseline.vehicle[num].or, req.baseline.vehicle[num].fuel.vkt);
                            }
                            
                            else if (req.baseline.vehicle[num].vehicleType === "Train") {
    
                                pasengerTransport = this.pmkCalculationTrain(req.baseline.pkm, req.baseline.vehicle[num].n, fuelEmission, req.baseline.vehicle[num].fuel.ef, pkmWithTrain);
                                console.log("pkmWithTrain====", pasengerTransport)
                            }
                            let anticipatedPKM = this.AnticipatedCalculation(crosePriseElasticity, req.project.fuel[pro].priceIncrease, pasengerTransport);
                            // console.log("anticipatedPKM====", anticipatedPKM) //61
                            let projetEmission = this.projectEmission(fuelEmission, anticipatedPKM, pasengerTransport);
                            console.log("anticipatedPKM====",fuelEmission, anticipatedPKM,pasengerTransport,projetEmission)
    
                            ghgImpact += projetEmission;
                        }
                       
                    }

                }

            }

            else if (req.projectType.projectApproch === ProjectTypeEnum.simplified) {

                let projectemission = 0;
                let fuelEmission = 0;
                let elcEmission = 0;
                let sale = 0, distance = 0;
                let marketShare = 0

                for (let num in req.baseline.vehicle) {
                            
                            distance = req.baseline.vehicle[num].distance;
                            
                            if (req.baseline.vehicle[num].fuel.type != "Electricity") {
                                let fuelEnergy = this.fuelEnergyWithVKT(1, req.baseline.vehicle[num].fuel.sfc, req.baseline.vehicle[num].fuel.density, req.baseline.vehicle[num].fuel.ncv, req.baseline.vehicle[num].fuel.ef);
                                fuelEmission += fuelEnergy
                            }
                            else {
                                let elecEnergy = this.elecEnergy(1, req.baseline.vehicle[num].fuel.sfc);

                                let Emission = this.emission(req.baseline.vehicle[num].fuel.ef, elecEnergy);
                                elcEmission += Emission;
                                // console.log("++++++++++++ppp",elecEnergy,Emission)
                            }


                    // console.log(fuelEmission)
                }
                let emissionReduction = fuelEmission - elcEmission;
                for(let n in req.project.vehicle){
                    marketShare = this.marketShare(req.project.vehicle[n], req.project.beta);
                    sale = req.project.vehicle[n].vahicleSale;
                    projectemission += this.ghgImpact(marketShare, sale, emissionReduction, distance);
                }

                

                ghgImpact = projectemission;
                var response1 = new icatCATResponceMsg();
                response1.baseLineEmission = parseFloat(Number(baseLineEmission).toFixed(2));
                response1.projectEmission = parseFloat(Number(baseLineEmission + ghgImpact).toFixed(2));
                response1.emissionReduction = parseFloat(Number(-1* ghgImpact).toFixed(2));
                return response1;
            }

            else if (req.projectType.projectApproch === ProjectTypeEnum.roadpricingSimlified) {

                let fuelEmission = 0;
                let fuelElasticity = 0;


                if (req.project.fuelMixPriceElasticity != 0) {
                    fuelElasticity = req.project.fuelMixPriceElasticity;
                }

                else {
                    // console.log("ppp")
                    const countriFuelPrice = await this.PPPPriceService.getPPPvalue(req.project.special.countryCode, req.project.special.year);

                    fuelElasticity = await this.elesticPrice(req.project.special.priceElasticity.mixFuelPrice, req.project.special.priceElasticity.capitalIncome, countriFuelPrice, req.project.special.year);
                }


                for (let num in req.baseline.vehicle) {
                    let vkt = this.changeVehicleTravel(req.baseline.vehicle[num].fuel.vkt, fuelElasticity, req.project.fuel[num].fuelPrice, req.baseline.vehicle[num].fuelEconomy, req.project.special.toilIncrease, req.project.special.existingToil);
                    console.log('vkt---', vkt)
                    let fuelEnergy = this.fuelEnergyWithVKT(vkt, req.baseline.vehicle[num].fuel.sfc, req.baseline.vehicle[num].fuel.density, req.baseline.vehicle[num].fuel.ncv, req.baseline.vehicle[num].fuel.ef);
                    fuelEmission += fuelEnergy;
                    console.log('fuelEmission---', fuelEmission)
                }
                ghgImpact = baseLineEmission + fuelEmission;

            }

            else if (req.projectType.projectApproch === ProjectTypeEnum.cordonPricing) {
                let fuelEmission = 0;

                for (let num in req.baseline.vehicle) {
                    let vkt = this.reduction(req.baseline.vehicle[num].fuel.vkt, req.baseline.vehicle[num].percentageReduction);

                    let fuelEnergy = this.fuelEnergyWithVKT(vkt, req.baseline.vehicle[num].fuel.sfc, req.baseline.vehicle[num].fuel.density, req.baseline.vehicle[num].fuel.ncv, req.baseline.vehicle[num].fuel.ef);
                    fuelEmission += fuelEnergy;
                    console.log(' vkt ===========', fuelEnergy)
                }
                ghgImpact = baseLineEmission - fuelEmission;
            }

        }

        var response = new icatCATResponceMsg();
        response.baseLineEmission = parseFloat(Number(baseLineEmission).toFixed(2));
        response.projectEmission = parseFloat(Number(ghgImpact).toFixed(2));
        response.emissionReduction = parseFloat(Number(baseLineEmission - ghgImpact).toFixed(2));
        response.year = req.project.year;

        // console.log("pppppppppppppppppppppppp" + response.baseLineEmission)
        return response;
    }

    // async getPPPvalue(countryCode: string, year: number) {
    //     // console.log(countryCode, year)
    //     const price = this.PPPPriceService.getPPPvalue(countryCode, year);
    //     // const price = (await this.repo.findOne({ countryCode, year })).value;

    //     // console.log(price);
    //     return price;
    // }

    // async getConsumerValue(year: number) {
    //     const price = await this.consumerPriceService.getConsumervalue("US", year);

    //     return price;
    // }

    public async elesticPrice(fuelPrice: number, capital: number, ppp: number, year: number) {
        let usPrice = this.consumerPriceService.getConsumervalue("US", year);
        let usPrice2016 = this.consumerPriceService.getConsumervalue("US", 2016);

        let fuelPriceUS = fuelPrice / ppp;
        let capitalIncome = capital / ppp;

        let fuelMinPrice = this.centerValue(await usPrice, await usPrice2016, 30);
        let fuelMaxPrice = this.centerValue(await usPrice, await usPrice2016, 80);

        let capitalMin = this.centerValue(await usPrice, await usPrice2016, 12000);
        let capitalMax = this.centerValue(await usPrice, await usPrice2016, 24000);

        // console.log(ppp, capitalIncome, fuelMinPrice, fuelMaxPrice, capitalMax, capitalMin)

        if (fuelMinPrice > fuelPrice && capitalIncome < capitalMin) { return -0.15; }
        else if (fuelMinPrice > fuelPrice && capitalIncome < capitalMax) { return -0.22; }

        else if (fuelMaxPrice < fuelPrice && capitalIncome < capitalMin) { return -0.26; }
        else if (fuelMaxPrice < fuelPrice && capitalIncome > capitalMax) { return -0.33; }

        else if (fuelMinPrice > fuelPrice && capitalIncome < capitalMax && capitalIncome > capitalMin) { return -0.11; }
        else if (fuelMaxPrice < fuelPrice && capitalIncome < capitalMax && capitalIncome > capitalMin) { return -0.32; }

        else if (fuelMinPrice < fuelPrice && fuelMaxPrice > fuelPrice && capitalIncome < capitalMin) { return -0.22; }
        else if (fuelMinPrice < fuelPrice && fuelMaxPrice > fuelPrice && capitalIncome < capitalMin) { return -0.22; }

        else if (fuelMinPrice < fuelPrice && fuelMaxPrice > fuelPrice && capitalIncome < capitalMax && capitalIncome > capitalMin) { return -0.24; }
    }

    public async elesticPriceWithdiesel(fuelPrice: number, capital: number, ppp: number, year: number) {

        let usPrice =await this.consumerPriceService.getConsumervalue("USA", year);
        let usPrice2016 =await this.consumerPriceService.getConsumervalue("USA", 2016);

        let fuelPriceUS = fuelPrice / ppp;
        let capitalIncome = capital / ppp;

        let fuelMinPrice = this.centerValue(await usPrice, await usPrice2016, 80);

        let capitalMin = this.centerValue(await usPrice, await usPrice2016, 18000);
        let capitalMax = this.centerValue(await usPrice, await usPrice2016, 24000);


        if (fuelMinPrice > fuelPrice && capitalIncome < capitalMin) { return -0.22; }
        else if (fuelMinPrice > fuelPrice && capitalIncome > capitalMax) { return -0.13; }


        else if (fuelMinPrice < fuelPrice && capitalIncome < capitalMin) { return -0.38; }
        else if (fuelMinPrice < fuelPrice && capitalIncome > capitalMax) { return -0.27; }
    }

    public async crossElesticPriceWithdiesel(fuelPrice: number, capital: number, ppp: number, year: number, vehicleType: string) {

        let usPrice = await this.consumerPriceService.getConsumervalue("USA", year);
        let usPrice2016 = await this.consumerPriceService.getConsumervalue("USA", 2016);
        
        let fuelPriceUS = fuelPrice / ppp;
        let capitalIncome = capital / ppp;
      
        let fuelMinPrice = this.centerValue(await usPrice, await usPrice2016, 30);
        let fuelMaxPrice = this.centerValue(await usPrice, await usPrice2016, 80);

        let capitalMin = this.centerValue(await usPrice, await usPrice2016, 12000);
        let capitalMax = this.centerValue(await usPrice, await usPrice2016, 24000);
        if (vehicleType === "Bus") {

            if (fuelPrice < fuelMinPrice && capitalIncome < capitalMin) { return 0.09; }
            else if (fuelPrice < fuelMinPrice && capitalIncome > capitalMax) { return 0.14; }


            else if (fuelPrice > fuelMaxPrice && capitalIncome < capitalMin) { return 0.16; }
            else if (fuelPrice > fuelMaxPrice && capitalIncome > capitalMax) { return 0.21; }

            else if (fuelPrice < fuelMinPrice && capitalMin < capitalIncome && capitalIncome < capitalMax) { return 0.07; }
            else if (fuelPrice > fuelMaxPrice && capitalMin < capitalIncome && capitalIncome < capitalMax) { return 0.2; }

            else if (fuelMinPrice < fuelPrice && fuelPrice < fuelMaxPrice && capitalIncome < capitalMin) { return 0.14; }
            else if (fuelMinPrice < fuelPrice && fuelPrice < fuelMaxPrice && capitalIncome > capitalMax) { return 0.14; }

            else if (fuelMinPrice < fuelPrice && fuelPrice < fuelMaxPrice && capitalMin < capitalIncome && capitalIncome < capitalMax) { return 0.15; }
        }
        else {
            if (fuelPrice < fuelMinPrice && capitalIncome < capitalMin) { return -0.15; }
            else if (fuelPrice < fuelMinPrice && capitalIncome > capitalMax) { return -0.22; }


            else if (fuelPrice > fuelMaxPrice && capitalIncome < capitalMin) { return -0.26; }
            else if (fuelPrice > fuelMaxPrice && capitalIncome > capitalMax) { return -0.32; }

            else if (fuelPrice < fuelMinPrice && capitalMin < capitalIncome && capitalIncome < capitalMax) { return -0.11; }
            else if (fuelPrice > fuelMaxPrice && capitalMin < capitalIncome && capitalIncome < capitalMax) { return -0.31; }

            else if (fuelMinPrice < fuelPrice && fuelPrice < fuelMaxPrice && capitalIncome < capitalMin) { return -0.22; }
            else if (fuelMinPrice < fuelPrice && fuelPrice < fuelMaxPrice && capitalIncome > capitalMax) { return -0.22; }

            else if (fuelMinPrice < fuelPrice && fuelPrice < fuelMaxPrice && capitalMin < capitalIncome && capitalIncome < capitalMax) { return -0.24; }
        }



    }

    private centerValue(currentValue: number, oldValue: number, centerValue: number) {
        return centerValue * currentValue / oldValue;
    }

    public GDPRatio(vkt: number, gdp: number): number {
        return vkt / gdp;
    }
    public fuelEnergyWithVKT(vkt: number, sfc: number, density: number, ncv: number, ef: number) {
        let unit_conversion = 1000000000;
        let energy = vkt * sfc * density * ncv / unit_conversion;
        return this.emission(ef, energy)
    }

    public fuelEnergyWithFC(fc: number, density: number, ncv: number, ef: number) {
        let unit_conversion = 1000000000;
        let energy = fc * density * ncv / unit_conversion;
        return this.emission(ef, energy)
    }

    public elecEnergy(vkt: number, sfc: number) {
        let unit_conversion = 1000;
        return vkt * sfc / unit_conversion;
    }

    public emission(ef: number, energy: number) {
        return ef * energy;
    }

    public eleEmission(ef: number, fc: number) {
        let unit_conversion = 0.0036; //MWh - Tj
        return ef * fc * unit_conversion;
    }

    public trainPKM(energy: number, ef: number, n: number) {
        return energy * n / ef;
    }

    public marketShare(project: VehicleDto, beta: number) {

        return (project.prevuiousTax - project.newTax) * beta / project.price;
    }

    public emissionReduction(fuelVehicleEmission: number, fuelVehicleVKT: number, eleVehicleEmission: number, eleVehicleVKT: number) {

        let fuelEmission = fuelVehicleEmission / fuelVehicleVKT;
        let eleEmission = eleVehicleEmission / eleVehicleVKT;

        return (fuelEmission - eleEmission) * 1000;
    }

    public ghgImpact(marketShare: number, sele: number, reduction: number, distance: number) {
        return marketShare * sele * reduction * distance;
    }

    public baseLineEmission(fuelUsed: number, fuelShare: number, ef: number) {
        let presentage = 100;
        return fuelUsed * fuelShare * ef / presentage;
    }

    public baseLineEmissoioB(fuelUsedWeight: number, fuelUseLiter: number, density: number, ncv: number, ef: number) {
        if (fuelUsedWeight === 0 || fuelUsedWeight === null) {
            let unit_conversion = 1000000;
            return fuelUseLiter * density * ncv * ef / unit_conversion;
        }
        else {
            return fuelUsedWeight * ncv * ef;
        }

    }

    public AnticipatedCalculation(fuelElasticity: number, mixPrice: number, energy: number) {
        // console.log("MMMM",fuelElasticity,mixPrice,energy)
        let presentage = 100;
        return ((fuelElasticity * mixPrice / presentage) + 1) * energy;
    }

    public pkmCalculation(or: number, vkt: number) {
        return or * vkt;
    }
    public pmkCalculationTrain(pkm: number, n: number, energy: number, ef: number, trainpkm: number) {

        return pkm * n * energy / (trainpkm * ef);
    }


    public projectEmission(be: number, pkm: number, pasengerTransport: number) {
        return be * pkm / pasengerTransport;
    }

    public changeVehicleTravel(vkt: number, elasticitY: number, price: number, fuelEconomy: number, tollIncrease: number, exToll: number) {

        let fuelCost = price * fuelEconomy;
        console.log(fuelCost)
        let drivingCost = tollIncrease / (exToll + fuelCost);
        console.log(drivingCost)
        console.log(elasticitY)
        console.log(vkt)
        return drivingCost * elasticitY * vkt;

    }

    public reduction(vkt: number, reduction: number) {
        let presentage = 100;
        return vkt * reduction / presentage;
    }



}
