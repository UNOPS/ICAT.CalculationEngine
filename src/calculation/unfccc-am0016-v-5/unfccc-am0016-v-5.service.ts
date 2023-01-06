import { Injectable } from '@nestjs/common';
import e from 'express';
import { VehicleTypeEnum } from './enum/vehicle-type.enum';
import { baselineDto } from './dto/baseline.dto';
import { leakageDto } from './dto/leakage.dto';
import { projecteDto } from './dto/project.dto';
import { vehicleDto } from './dto/vehicle.dto';
import { fuelDto } from './dto/fuel.dto';
import { UnfcccAm0016V5ReqMsg } from './message/unfccc-am0016-v-5-req-msg';
import { UnfcccAm0016V5ResMsg } from './message/unfccc-am0016-v-5-res-msg';

@Injectable()
export class UnfcccAm0016V5Service {

    public async ICATM3(req: UnfcccAm0016V5ReqMsg) {

        var responseArray = new Array();
        let le = 0

        for (let num in req.baseline) {

            var response = new UnfcccAm0016V5ResMsg();
            let be = this.baselineEmission(req.baseline[num]);
            let d_pe_fuel = this.d_pe_fuel(req.project[num]);
            let d_pe_elec = this.d_pe_elec(req.project[num]);
            let i_pe = this.i_pe(req.project[num], req.baseline[num]);

            let pe = d_pe_fuel + d_pe_elec + i_pe

            for await (let project of req.project) {
                for (let base of req.baseline) {
                    let leakage = await this.leakageEmission(base, project);
                    console.log("be", leakage)
                    le += await leakage;
                }
            }
            let er = be - pe - le

            response.baselineEmission = be;
            response.projectEmission = pe;
            response.leakageEmission = le;
            response.emissionReduction = er;

            // if (req.leakage) {
            //     for (let m in req.leakage[num].vehicle) {//buses and taxis

            //         if (req.leakage[num].vehicle[m].type === "buses" || req.leakage[num].vehicle[m].type === "taxis") {
            //             let leakageloadfactor = this.leakageloadfactorbusesandtaxis(req.leakage[num].vehicle[m]);
            //             console.log("leakageloadfactor==", leakageloadfactor)
            //             leakageloadfactorbusesandtaxis += leakageloadfactor;
            //             console.log("leakageloadfactorbusesandtaxis==", leakageloadfactorbusesandtaxis)

            //         }

            //         let leakageduetoreducedcongestion = this.leakageduetoreducedcongestion(req.leakage[num]);//car and taxis
            //         console.log("leakageduetoreducedcongestion==", leakageduetoreducedcongestion)


            //         let leakage = leakageloadfactorbusesandtaxis + leakageduetoreducedcongestion;
            //         console.log("leakage==", leakage)


            //         response.leakageEmission = leakage;



            //     }
            // }

            responseArray.push(response);

        }

        return responseArray

    }


    public baselineEmission(baseline: baselineDto) {
        console.log("============BaselineEmission=============")
        let BEy: number = 0;
        let BEyt: number = 0;
        //  let BEyT: number = 0;


        let efkmix: number = 0;
        let tefkmix: number = 0;
        let efpkmix: number = 0;

        let telix: number = 0;
        let p: number = 0;


        // start
        for (let num in baseline.vehicle) {

            let vtype = baseline.vehicle[num].type;
            if (vtype == "Car(fuel)" || vtype == "Bus(fuel)" || vtype == "Taxi(fuel)" || vtype == "Motorcycle(fuel)") {//fuel based

                if (baseline.vehicle[num].efpkmix > 0) {
                    console.log("efpkmix", baseline.vehicle[num].efpkmix)
                    efpkmix = baseline.vehicle[num].efpkmix;

                }
                else if (baseline.vehicle[num].efpkmix == 0) {
                    if (baseline.vehicle[num].efkmi1_4 > 0) {//ekmix
                        efpkmix = baseline.vehicle[num].efkmi1_4;

                        efpkmix = efpkmix / baseline.vehicle[num].ocix;

                    }
                    else if (baseline.vehicle[num].efkmi1_4 == 0) {


                        efkmix = (baseline.vehicle[num].sfcinx * baseline.vehicle[num].fuel.ncv * baseline.vehicle[num].fuel.efco2 +
                            baseline.vehicle[num].sfcinx * baseline.vehicle[num].fuel.efco2) * baseline.vehicle[num].ninx / baseline.vehicle[num].nix;


                        efpkmix = efkmix / baseline.vehicle[num].ocix;

                    }


                }
                console.log("efpkmix", efpkmix);
                console.log("t", baseline.vehicle[num].t);

                p = baseline.vehicle[num].t;



                if (baseline.vehicle[num].si && baseline.vehicle[num].di) {
                    BEy = Math.pow(baseline.vehicle[num].iri, p) * efpkmix * baseline.vehicle[num].di * baseline.vehicle[num].si * 0.01;
                    
                    console.log("iri===", baseline.vehicle[num].iri)
                    console.log("di===", baseline.vehicle[num].di)
                    console.log("si===", baseline.vehicle[num].si)
                    console.log("p===", p)
                    console.log("BEy===", BEy)


                }
                else if (baseline.vehicle[num].sdi) {
                    BEy = Math.pow(baseline.vehicle[num].iri, p) * efpkmix * baseline.vehicle[num].sdi;

                }

            }

            else if (
                baseline.vehicle[num].type == "Car(electric)"
                || baseline.vehicle[num].type == "Bus(electric)"
                || baseline.vehicle[num].type == "Motorcycle(electric)"
                || baseline.vehicle[num].type == "Taxi(electric)"
            ) {//electricity based
                console.log("Electricity", baseline.vehicle[num].fuel.type)


                if (baseline.vehicle[num].efpkmix > 0) {
                    efpkmix = baseline.vehicle[num].efpkmix;
                    console.log("elec-efpkmix===", efpkmix)

                }
                else if (baseline.vehicle[num].efpkmix == 0) {

                    telix = baseline.vehicle[num].fuel.ecblky * baseline.vehicle[num].fuel.efelky * (1 + baseline.vehicle[num].fuel.tdlky);

                    console.log("telix===", telix)

                    efpkmix = telix * 1000000 / (baseline.vehicle[num].pelix * baseline.vehicle[num].delix);
                    console.log("telix-efpkmix===", efpkmix)

                }
                p = baseline.vehicle[num].t;

                if (baseline.vehicle[num].si && baseline.vehicle[num].di) {
                    BEy = Math.pow(baseline.vehicle[num].iri, p) * efpkmix * baseline.vehicle[num].di * baseline.vehicle[num].si;

                    console.log("Elec-BEy===", BEy)


                }
                else if (baseline.vehicle[num].sdi) {
                    BEy = Math.pow(baseline.vehicle[num].iri, p) * efpkmix * baseline.vehicle[num].sdi;

                }

            }

            BEyt = BEyt + BEy;

        }


        console.log("BaseLineEmission===", BEyt * baseline.py * 0.000001)

        return BEyt * baseline.py * 0.000001;

    }




    public d_pe_fuel(project: projecteDto) {
        console.log("============DirectPEFromFuel=============")
        let pefcy: number = 0;
        let tpefcy: number = 0;
        let efkmzy: number = 0;
        let tefkmkzy: number = 0;

        for (let n in project.vehicle) {// trunk buses and feeder buses

            if ((project.vehicle[n].fuel.type == "LNG" || project.vehicle[n].fuel.type == "FFF") &&
                project.vehicle[n].fuel.type != "Electricity" 
                && project.vehicle[n].type != "Cars(Indirect)"
                && project.vehicle[n].type != "Buses(Indirect)"
                && project.vehicle[n].type != "Taxis(Indirect)") { //direct PE from Fuel
                console.log("fuel==", project.vehicle[n].fuel.type)

                if (project.vehicle[n].fcpjny) {//check if have total fuel consumption
                    if (project.vehicle[n].fuel.pn) {
                        console.log("fcpjny=========", project.vehicle[n].fcpjny)
                        console.log("ncv=========", project.vehicle[n].fuel.ncv)
                        console.log("pn=========", project.vehicle[n].fuel.pn)
                        console.log("efco2=========", project.vehicle[n].fuel.efco2)
                        console.log("gwpch4=========", project.gwpch4)
                        console.log("efch4n=========", project.vehicle[n].fuel.efch4n)

                        pefcy = project.vehicle[n].fcpjny * project.vehicle[n].fuel.ncv * project.vehicle[n].fuel.pn * (project.vehicle[n].fuel.efco2 + project.gwpch4 * project.vehicle[n].fuel.efch4n) * 0.000001;
                        console.log("pefcy=========", pefcy)
                        tpefcy += pefcy;
                        console.log("tpefcy=========", tpefcy)


                    } else {
                        pefcy = project.vehicle[n].fcpjny * project.vehicle[n].fuel.ncv * (project.vehicle[n].fuel.efco2 + project.gwpch4 * project.vehicle[n].fuel.efch4n) * 0.000001;

                        tpefcy += pefcy;

                    }

                } else {

                    if (project.vehicle[n].efkmzy) {
                        efkmzy = project.vehicle[n].efkmzy;
                        console.log("efkmzy====", efkmzy)
                        tefkmkzy += efkmzy
                        console.log("tefkmzy====", tefkmkzy)


                    } else {

                        if (project.vehicle[n].fuel.pn) {
                            efkmzy = project.vehicle[n].sfczny * project.vehicle[n].fuel.ncv * project.vehicle[n].fuel.pn * (project.vehicle[n].fuel.efco2 + project.gwpch4 * project.vehicle[n].fuel.efch4n) * 1000;
                            tefkmkzy += efkmzy
                            console.log("tefkmzy====", tefkmkzy)


                        } else {
                            efkmzy = project.vehicle[n].sfczny * project.vehicle[n].fuel.ncv * (project.vehicle[n].fuel.efco2 + project.gwpch4 * project.vehicle[n].fuel.efch4n) * 1000;

                            tefkmkzy += efkmzy


                        }

                    }
                    console.log("ddzny===", project.vehicle[n].ddzy)
                    tpefcy = project.vehicle[n].ddzy * tefkmkzy * 0.000001;
                    console.log("tpefcy===", tpefcy)

                }


            }

            else if ((project.vehicle[n].fuel.type == "Diesel" || project.vehicle[n].fuel.type == "Petrol") &&
                (project.vehicle[n].type != "Cars(Indirect)" || project.vehicle[n].type != "Buses(Indirect)" || project.vehicle[n].type != "Taxis(Indirect)")) {

                if (project.vehicle[n].fuel.pn) {


                    console.log("fcpjny=========", project.vehicle[n].fcpjny)
                    console.log("wciy=========", project.vehicle[n].fuel.wciy)


                    pefcy = project.vehicle[n].fcpjny * project.vehicle[n].fuel.wciy * project.vehicle[n].fuel.pn * 44 / 12;

                }
                else if (project.vehicle[n].fuel.ncv && project.vehicle[n].fuel.efco2) {

                    pefcy = project.vehicle[n].fcpjny * project.vehicle[n].fuel.ncv * project.vehicle[n].fuel.efco2;

                }
                else {
                    pefcy = project.vehicle[n].fcpjny * project.vehicle[n].fuel.wciy * 44 / 12;

                }

                tpefcy += pefcy

            }
        }

        if (tpefcy) {
            return tpefcy;

        } else { return 0 }
    }

    public d_pe_elec(project: projecteDto) {
        console.log("============DirectPEFromElec=============")

        let peecy: number = 0;
        let tpeecy: number = 0;
        let efefjy: number = 0;
        let ecpjjy: number = 0;


        for (let m in project.vehicle) {

            if (project.vehicle[m].fuel.type == "Electricity") {

                console.log("fuel====", project.vehicle[m].fuel.type)
                console.log("fcpjny====", project.vehicle[m].fcpjny)
                console.log("efefjy====", project.vehicle[m].fuel.efefjy)
                console.log("tdljy====", project.vehicle[m].fuel.tdljy)

                //calculate EFefjy
                if (project.vehicle[m].fcpjny) {
                    ecpjjy = project.vehicle[m].fcpjny;

                }
                else {
                    ecpjjy = project.vehicle[m].sfczny * project.vehicle[m].ddzy * 0.001;

                }
                peecy = ecpjjy * project.vehicle[m].fuel.efefjy * (1 + project.vehicle[m].fuel.tdljy * 0.01);
                console.log("peecy====", peecy)

                console.log("currnt-tpeecy", tpeecy)
                console.log("current-peecy====", peecy)

                tpeecy = + peecy;
                console.log("tpeecy====", tpeecy)

            }
        }
        if (tpeecy) {
            return tpeecy;

        } else {
            return 0
        }

    }

    public i_pe(project: projecteDto, baseline: baselineDto) {
        console.log("============IndirectPE=============")

        let ipe: number = 0;
        let tipe: number = 0;
        let Tipe: number = 0;
        for (let m in project.vehicle) {

            if (project.vehicle[m].type == "Cars(Indirect)" ||
                project.vehicle[m].type == "Buses(Indirect)" ||
                project.vehicle[m].type == "Taxis(Indirect)") {//only indirect vehicles
                console.log("ddzy====", project.vehicle[m].ddzy)
                console.log("efkmzy====", project.vehicle[m].efkmzy)
                console.log("py====", project.py)

                if (project.vehicle[m].efkmzy) {
                    ipe = project.vehicle[m].ddzy * project.vehicle[m].efkmzy * 0.000001;
                    tipe += ipe;

                }
                else {
                    ipe = project.vehicle[m].ddzy * project.vehicle[m].efkmix * project.vehicle[m].p * 0.000001;
                    tipe += ipe;

                }

            }

        }

        Tipe = tipe * project.py;
        console.log("==Tipe==", Tipe)

        if (Tipe) {
            return Tipe;

        } else {
            return 0
        }
    }





    // public leakageloadfactorbusesandtaxis(vehicle: vehicleDto) { // Bus and Taxi

    //     console.log("===========LeakageLoadfac=========")
    //     let lelfzy: number = 0;
    //     let adz: number = 0;
    //     let d: number = 0;
    //     let nob: number = 0;
    //     let td: number = 0;
    //     let tnob: number = 0;
    //     let roz1_4: number = 0;
    //     let rozx: number = 0;
    //     let tlelfzy: number = 0;

    //     if (vehicle.adz > 0) {
    //         adz = vehicle.adz
    //         console.log("adz", adz)

    //     } else if (vehicle.adz == 0) {

    //         adz = vehicle.ddzsx / vehicle.nzsx; //total distance/no buses

    //     }

    //     if (vehicle.rocz1_4 > 0) {
    //         roz1_4 = vehicle.rocz1_4;
    //         console.log("rocz1_4", roz1_4)

    //     }
    //     else if (vehicle.rocz1_4 === 0) {
    //         roz1_4 = vehicle.oczt1_4 / vehicle.cvzt1_4
    //     }

    //     if (vehicle.roczx > 0) {
    //         rozx = vehicle.roczx

    //     }

    //     else if (vehicle.roczx === 0) {

    //         rozx = vehicle.oczt / vehicle.cvzt;
    //     }

    //     console.log("ni1_4", vehicle.efpkmix)
    //     lelfzy = (vehicle.ni1_4 * adz * vehicle.efpkmix * (1 - roz1_4 / rozx)) / 1000000;
    //     console.log("lelfzy", lelfzy)

    //     if (lelfzy > 0) {
    //         tlelfzy = lelfzy;
    //     }
    //     else if (lelfzy <= 0) {
    //         tlelfzy = 0;
    //     }
    //     console.log("tlelfzy", tlelfzy)

    //     return tlelfzy;

    // }

    // public leakageduetoreducedcongestion(leakage: leakageDto) { //Taxi Or Car

    //     console.log("========leakagecongestion========")

    //     let arsy: number = 0;
    //     let srsx: number = 0;
    //     let tarsy: number = 0;



    //     let lecongy: number = 0;

    //     let lereby: number = 0;
    //     let lespy: number = 0;

    //     let efkmix: number = 0;

    //     let efkmi1_4: number = 0;

    //     let nimsy: number = 0;

    //     let tlereby: number = 0;
    //     let tlespy: number = 0;



    //     if (leakage.srsx > 0) {
    //         srsx = leakage.srsx;
    //         console.log("srsx", srsx)

    //     }

    //     else if (leakage.srsx === 0) {

    //         srsx = leakage.tdbx * 2.5 / (leakage.tdbx * 2.5 + leakage.tdtx + leakage.tdcx);

    //     }

    //     arsy = (leakage.bscry * srsx) / leakage.nzx - (leakage.rsx - leakage.rsy) / leakage.rsx;
    //     console.log("arsy", arsy)

    //     tarsy = arsy;


    //     if (tarsy > 0) {
    //         lecongy = 0;
    //     }
    //     else if (tarsy < 0) {


    //         for (let m in leakage.vehicle) {
    //             console.log("ggggggggg", m)


    //             if (leakage.vehicle[m].type === "cars" || leakage.vehicle[m].type === "taxis") {

    //                 console.log("77777774")

    //                 if (leakage.vehicle[m].efkmi1_4 > 0) {

    //                     efkmi1_4 = leakage.vehicle[m].efkmi1_4;
    //                     console.log("efkmi1_4", efkmi1_4)

    //                 }

    //                 if (leakage.vehicle[m].nimsy > 0) {
    //                     nimsy = leakage.vehicle[m].nimsy;
    //                     console.log("nimsy===", nimsy)

    //                 }
    //                 else if (leakage.vehicle[m].nimsy === 0) {
    //                     nimsy = leakage.vehicle[m].msi1_4 * leakage.py / leakage.vehicle[m].ocix;
    //                     console.log("nimsy===", nimsy)
    //                 }

    //                 lereby = leakage.vehicle[m].tdi1_4 * efkmi1_4 * (leakage.vehicle[m].ni1_4_a - leakage.vehicle[m].nix + nimsy);

    //                 console.log("lereby", lereby)

    //                 lespy = (leakage.vehicle[m].ni1_4_a * leakage.vehicle[m].tdi1_4 * (leakage.vehicle[m].efkmvpi1_4 - leakage.vehicle[m].efkmvbi)) / 1000000;

    //                 console.log("lllllll====", lespy)
    //             }
    //             console.log("tlerebybefore===", tlereby)

    //             tlereby += lereby;
    //             console.log("tlereby===", tlereby)

    //             console.log("tlespy22===", tlespy)

    //             tlespy += lespy;
    //             console.log("tlespy===", tlespy)




    //         }
    //         lecongy = tlereby + tlespy;
    //         console.log("lecong", lecongy)

    //         //else

    //     }

    //     return lecongy;

    // }




    public async leakageEmission(base: baselineDto, pro: projecteDto) {
        console.log("==========Leakage===============")
        let unit = 1000000;
        let LE = 0;
        let LE_lfz = 0;
        let LE_lft = 0;
        let LE_cong = 0;
        let LE_up = 0;

        let LE_reb = 0;
        let LE_spy = 0;
        let ars_y = 0;

        for await (let vehi of pro.vehicle) {
            for await (let baseVehi of base.vehicle) {
                if ((vehi.type == "Cars(Indirect)" && baseVehi.type == "Car(fuel)")
                    || (vehi.type == "Buses(Indirect)" && baseVehi.type == "Bus(fuel)")
                    || (vehi.type == "Taxis(Indirect)" && baseVehi.type == "Taxi(fuel)")
                ) {


                    //   if (vehi.type == baseVehi.type) {
                    if (vehi.type == "Buses(Indirect)") {

                        let srs = pro.leakege.src;
                        if (srs == undefined || srs == null || !pro.leakege.src) {
                            srs = pro.leakege.dd_zx * 2.5 / (pro.leakege.dd_zx * 2.5 + pro.leakege.dd_tx + pro.leakege.dd_cx);
                        }
                        // console.log("ars+++be===",srs)
                        let ars = (pro.leakege.bscr / vehi.nzx) * srs - ((pro.leakege.rsx - pro.leakege.rsy) / pro.leakege.rsx);
                        ars_y += ars;

                    }
                }

            }

        }

        for (let projectVehi of pro.vehicle) {
            for await (let baseVehi of base.vehicle) {
                //if (projectVehi.type == baseVehi.type) {
                if ((projectVehi.type == "Cars(Indirect)" && baseVehi.type == "Car(fuel)")
                    || (projectVehi.type == "Buses(Indirect)" && baseVehi.type == "Bus(fuel)")
                    || (projectVehi.type == "Taxis(Indirect)" && baseVehi.type == "Taxi(fuel)")
                ) {
                    let roc_iy = projectVehi.or / projectVehi.cv; //project Average occupancy rate relative to capacity in category i in year y
                    let roc_ix = baseVehi.or / baseVehi.cv; //baseline

                    //console.log("ars_y+++be===",projectVehi.or,projectVehi.cv)

                    // console.log("ars_y+++be===",roc_iy,roc_ix)
                    let ef = projectVehi.efkmzy;
                    let nisy = projectVehi.nisy;
                    let vd = baseVehi.ddzy;

                    console.log("ars_y+++be===", ef, nisy, vd)

                    if (vd == null || vd == undefined || !projectVehi.ddzy) {
                        vd = baseVehi.dd_l * baseVehi.dd_m * baseVehi.dd_s / baseVehi.nzx;
                    }
                    if (nisy == null || nisy == undefined || !projectVehi.nisy) {
                        nisy = projectVehi.ms * base.py / projectVehi.or;
                    }
                    if (ef == null || ef == undefined || !projectVehi.efkmzy) {
                        //  ef = projectVehi.sfc * projectVehi.fuel.ncv * projectVehi.fuel.ef * projectVehi.ninx / projectVehi.nzx;
                    }
                    // console.log("ars_y+++be===",ars_y,projectVehi.vehicleName)
                    if (ars_y <= 0 && (projectVehi.type == "Cars(Indirect)" || projectVehi.type == "Taxis(Indirect)")) {

                        console.log("arsy==", ars_y)
                        let le_reb = projectVehi.ddzy * ef * (projectVehi.nzx - baseVehi.nzx + nisy) / unit;
                        let efbe = this.be(ef, baseVehi.v, projectVehi.v);
                        let le_sp = projectVehi.ddzy * projectVehi.n * (ef - efbe) / unit;

                        LE_reb += le_reb;
                        LE_spy += le_sp;
                    }

                    if (projectVehi.type == "Buses(Indirect)") {
                        if ((roc_ix - roc_iy) <= 0.1) {
                            LE_lfz = 0;
                        }
                        else {
                            let le = ef * vd * projectVehi.nzx * (1 - (roc_iy / roc_ix)) / unit;
                            LE_lfz = Math.max(le, 0);
                        }

                    }
                    if (projectVehi.type == "Taxis(Indirect)") {
                        if ((roc_ix - roc_iy) <= 0.1) {
                            LE_lft = 0;
                        }
                        else {
                            let le = ef * vd * projectVehi.nzx * (1 - (roc_iy / roc_ix)) / unit;
                            LE_lft = Math.max(le, 0);
                        }
                    }

                }

            }


        }

        let LE_upA = 0 //await (this.pro_FC - this.base_FC);
        //  console.log("======", this.pro_FC, this.base_FC)
        if (ars_y > 0) {
            LE_cong = 0;
        }

        if (ars_y <= 0) {
            let le = LE_reb + LE_spy;
            LE_cong = Math.max(le, 0);
        }
        console.log("LE_cong", LE_cong)
        console.log("LE_lft", LE_lft)
        console.log("LE_lfz", LE_lfz)
        console.log("LE_up", LE_upA)
        LE_up = Math.max(LE_upA, 0);
        LE = LE_cong + LE_lft + LE_lfz + LE_up;
        return LE;
    }
    public be(ef: number, vb: number, vp: number) {
        let v = Math.pow((vp / vb), -0.7);

        return ef / v;
    }

}