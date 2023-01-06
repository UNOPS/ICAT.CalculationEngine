import { Injectable } from "@nestjs/common";
import { CdmAm0031ReqMsg } from "./massage/adm-am0031-req-msg";
import { ResponseMsg } from "../jica-railway-freight/message/res.msg";
import { BaseLineDto } from "./dto/baseline.dto";
import { VehicleDto } from "src/calculation/unfccc-ams-iii-s-v-4/dto/vehicle.dto";
import { ProjectDto } from "./dto/project.dto";
import { VehicleTypeEnum } from "../enum/vehicle-type.enum";
import { LeakageDto } from "./dto/leakage.dto";

@Injectable()
export class CDMAM0031Service {

    // bus_distance = 0;
    // car_distance = 0;
    // taxi_distance = 0;
    base_FC = 0;
    pro_FC = 0;

    public async cal(req: CdmAm0031ReqMsg) {
        let res = new ResponseMsg();
        let be = 0;
        let pe = 0;
        let le = 0

        for (let i in req.baseline) {
            let base = this.baseline(req.baseline[i]);
            be += base;
        }
        for (let y in req.projectEmission) {
            let pro = this.projectEmssion(req.projectEmission[y]);
            pe += pro;
        }

        for await (let project of req.projectEmission) {
            for (let base of req.baseline) {
                let leakage = await this.leakageEmission(base, project);
                console.log("be", leakage)
                le += await leakage;
            }
        }

        res.baseLineEmission = parseFloat(Number(be).toFixed(5));
        res.projectEmission = parseFloat(Number(pe).toFixed(5));
        res.lecageEmission = parseFloat(Number(le).toFixed(5));
        res.emissionReduction = parseFloat(Number(be - pe - le).toFixed(5));
        console.log("res++++++++++++", res)
        this.base_FC = 0
        this.pro_FC = 0
        return res;

    }

    public baseline(bass: BaseLineDto): number {

        let base = 0;
        let be = 0;

        for (let baseVehicle of bass.vehicle) {
            be += this.calBE(baseVehicle);
        }
        return be * bass.p;
    }

    public calBE(vehi: VehicleDto): number {
        let unit = 1000000;
        let EF_pkm = 0;
        let pow = vehi.t + vehi.y - 1;
        let irpow = Math.pow(vehi.ir, pow);
        let SD = vehi.sd;
        if (SD == 0 || SD == null || SD == undefined) {
            SD = vehi.d * vehi.ms;
        }

        if (vehi.vehicleType != VehicleTypeEnum.electric_vehicle) {

            let EF_km = vehi.ef_km;

            if (EF_km == 0 || EF_km == null || EF_km == undefined) {
                EF_km = vehi.sfc * vehi.fuel.ncv * vehi.fuel.ef * vehi.ninx / vehi.nzx;
            }

            if (vehi.fc_mass !== 0 && vehi.fc_mass !== null && vehi.fc_mass !== undefined) {
                this.base_FC += vehi.fc_mass * vehi.fuel.ncv * vehi.fuel.ef / 1000;
            }
            else {
                this.base_FC += vehi.fc * vehi.fuel.density * vehi.fuel.ncv * vehi.fuel.ef / 1000;
            }
            EF_pkm = EF_km / vehi.or;
        }

        else {
            EF_pkm = vehi.fuel.ef * unit / (vehi.p * vehi.d);
        }

        let be = irpow * EF_pkm * SD / unit;
        // console.log("+++be",EF_pkm,SD)
        return be;
    }


    public projectEmssion(pro: ProjectDto) {
        let unit = 0.000001;
        for (let num in pro.vehicle) {
            let ef = pro.vehicle[num].fuel.ef + pro.vehicle[num].fuel.gwp * pro.vehicle[num].fuel.ef_ch4;
            if (pro.vehicle[num].vehicleType == VehicleTypeEnum.fuel_vehicle) {
                if (pro.vehicle[num].fc_mass > 0 && pro.vehicle[num].fc_mass !== undefined) {
                    this.pro_FC += pro.vehicle[num].fc_mass * pro.vehicle[num].fuel.ncv * pro.vehicle[num].fuel.ef / 1000;
                    return pro.vehicle[num].fc_mass * pro.vehicle[num].fuel.ncv * unit * ef;
                }
                else if (pro.vehicle[num].fc > 0 && pro.vehicle[num].fc !== undefined) {
                    this.pro_FC += pro.vehicle[num].fc * pro.vehicle[num].fuel.ncv * pro.vehicle[num].fuel.density * pro.vehicle[num].fuel.ef / 1000;
                    return pro.vehicle[num].fc * pro.vehicle[num].fuel.density * pro.vehicle[num].fuel.ncv * unit * ef;
                }
                else if (pro.vehicle[num].d > 0 && pro.vehicle[num].d !== undefined) {
                    if (pro.vehicle[num].ef_km > 0) {
                        return pro.vehicle[num].d * pro.vehicle[num].ef_km * unit;
                    }
                    else {
                        return pro.vehicle[num].d * pro.vehicle[num].sfc * pro.vehicle[num].fuel.ncv * ef * unit / 1000;
                    }
                }
            }

            else {
                let fc = pro.vehicle[num].fc;
                if (fc > 0 && fc !== undefined && pro.vehicle[num].fc && fc !== null) {
                    return pro.vehicle[num].fc * pro.vehicle[num].fuel.ef * (1 + pro.vehicle[num].fuel.tdl)

                }
                else {
                    return pro.vehicle[num].sfc * pro.vehicle[num].d * pro.vehicle[num].fuel.ef * (1 + pro.vehicle[num].fuel.tdl) / 1000;
                }

            }

        }

        // return 0;
    }

    public async leakageEmission(base: BaseLineDto, pro: ProjectDto) {
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
                if (vehi.vehicleName == baseVehi.vehicleName) {
                    if (vehi.vehicleName == "bus" || vehi.vehicleName == "Bus") {
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
                if (projectVehi.vehicleName == baseVehi.vehicleName) {
                    let roc_iy = projectVehi.or / projectVehi.cv; //project Average occupancy rate relative to capacity in category i in year y
                    let roc_ix = baseVehi.or / baseVehi.cv; //baseline
                    // console.log("ars_y+++be===",roc_iy,roc_ix)
                    let ef = projectVehi.ef_km;
                    let nisy = projectVehi.nisy;
                    let vd = baseVehi.d;
                    if (vd == null || vd == undefined || !projectVehi.d) {
                        vd = baseVehi.dd_l * baseVehi.dd_m * baseVehi.dd_s / baseVehi.nzx;
                    }
                    if (nisy == null || nisy == undefined || !projectVehi.nisy) {
                        nisy = projectVehi.ms * base.p / projectVehi.or;
                    }
                    if (ef == null || ef == undefined || !projectVehi.ef_km) {
                        ef = projectVehi.sfc * projectVehi.fuel.ncv * projectVehi.fuel.ef * projectVehi.ninx / projectVehi.nzx;
                    }
                    // console.log("ars_y+++be===",ars_y,projectVehi.vehicleName)
                    if (ars_y <= 0 && (projectVehi.vehicleName == "Car" || projectVehi.vehicleName == "Taxi")) {
                        let le_reb = projectVehi.d * ef * (projectVehi.nzx - baseVehi.nzx + nisy) / unit;
                        let efbe = this.be(ef, baseVehi.v, projectVehi.v);
                        let le_sp = projectVehi.d * projectVehi.nzx * (ef - efbe) / unit;

                        LE_reb += le_reb;
                        LE_spy += le_sp;
                    }

                    if (projectVehi.vehicleName == "Bus") {
                        if ((roc_ix - roc_iy) <= 0.1) {
                            LE_lfz = 0;
                        }
                        else {
                            let le = ef * vd * projectVehi.nzx * (1 - (roc_iy / roc_ix)) / unit;
                            LE_lfz = Math.max(le, 0);
                        }

                    }
                    if (projectVehi.vehicleName == "Taxi") {
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

        let LE_upA = await (this.pro_FC - this.base_FC);
        console.log("======", this.pro_FC, this.base_FC)
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