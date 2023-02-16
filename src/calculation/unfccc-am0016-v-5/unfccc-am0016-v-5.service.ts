import { Injectable } from '@nestjs/common';
import { baselineDto } from './dto/baseline.dto';
import { projecteDto } from './dto/project.dto';
import { UnfcccAm0016V5ReqMsg } from './message/unfccc-am0016-v-5-req-msg';
import { UnfcccAm0016V5ResMsg } from './message/unfccc-am0016-v-5-res-msg';

@Injectable()
export class UnfcccAm0016V5Service {
  public async ICATM3(req: UnfcccAm0016V5ReqMsg) {
    const responseArray = [];
    let le = 0;

    for (const num in req.baseline) {
      const response = new UnfcccAm0016V5ResMsg();
      const be = this.baselineEmission(req.baseline[num]);
      const d_pe_fuel = this.d_pe_fuel(req.project[num]);
      const d_pe_elec = this.d_pe_elec(req.project[num]);
      const i_pe = this.i_pe(req.project[num], req.baseline[num]);

      const pe = d_pe_fuel + d_pe_elec + i_pe;

      for await (const project of req.project) {
        for (const base of req.baseline) {
          const leakage = await this.leakageEmission(base, project);

          le += await leakage;
        }
      }
      const er = be - pe - le;

      response.baselineEmission = be;
      response.projectEmission = pe;
      response.leakageEmission = le;
      response.emissionReduction = er;

      responseArray.push(response);
    }

    return responseArray;
  }

  public baselineEmission(baseline: baselineDto) {
    let BEy = 0;
    let BEyt = 0;
    let efkmix = 0;
    let efpkmix = 0;
    let telix = 0;
    let p = 0;

    for (const num in baseline.vehicle) {
      const vtype = baseline.vehicle[num].type;
      if (
        vtype == 'Car(fuel)' ||
        vtype == 'Bus(fuel)' ||
        vtype == 'Taxi(fuel)' ||
        vtype == 'Motorcycle(fuel)'
      ) {
        //fuel based

        if (baseline.vehicle[num].efpkmix > 0) {
          efpkmix = baseline.vehicle[num].efpkmix;
        } else if (baseline.vehicle[num].efpkmix == 0) {
          if (baseline.vehicle[num].efkmi1_4 > 0) {
            efpkmix = baseline.vehicle[num].efkmi1_4;

            efpkmix = efpkmix / baseline.vehicle[num].ocix;
          } else if (baseline.vehicle[num].efkmi1_4 == 0) {
            efkmix =
              ((baseline.vehicle[num].sfcinx *
                baseline.vehicle[num].fuel.ncv *
                baseline.vehicle[num].fuel.efco2 +
                baseline.vehicle[num].sfcinx *
                  baseline.vehicle[num].fuel.efco2) *
                baseline.vehicle[num].ninx) /
              baseline.vehicle[num].nix;

            efpkmix = efkmix / baseline.vehicle[num].ocix;
          }
        }

        p = baseline.vehicle[num].t;

        if (baseline.vehicle[num].si && baseline.vehicle[num].di) {
          BEy =
            Math.pow(baseline.vehicle[num].iri, p) *
            efpkmix *
            baseline.vehicle[num].di *
            baseline.vehicle[num].si *
            0.01;
        } else if (baseline.vehicle[num].sdi) {
          BEy =
            Math.pow(baseline.vehicle[num].iri, p) *
            efpkmix *
            baseline.vehicle[num].sdi;
        }
      } else if (
        baseline.vehicle[num].type == 'Car(electric)' ||
        baseline.vehicle[num].type == 'Bus(electric)' ||
        baseline.vehicle[num].type == 'Motorcycle(electric)' ||
        baseline.vehicle[num].type == 'Taxi(electric)'
      ) {
        //electricity based

        if (baseline.vehicle[num].efpkmix > 0) {
          efpkmix = baseline.vehicle[num].efpkmix;
        } else if (baseline.vehicle[num].efpkmix == 0) {
          telix =
            baseline.vehicle[num].fuel.ecblky *
            baseline.vehicle[num].fuel.efelky *
            (1 + baseline.vehicle[num].fuel.tdlky);

          efpkmix =
            (telix * 1000000) /
            (baseline.vehicle[num].pelix * baseline.vehicle[num].delix);
        }
        p = baseline.vehicle[num].t;

        if (baseline.vehicle[num].si && baseline.vehicle[num].di) {
          BEy =
            Math.pow(baseline.vehicle[num].iri, p) *
            efpkmix *
            baseline.vehicle[num].di *
            baseline.vehicle[num].si;
        } else if (baseline.vehicle[num].sdi) {
          BEy =
            Math.pow(baseline.vehicle[num].iri, p) *
            efpkmix *
            baseline.vehicle[num].sdi;
        }
      }

      BEyt = BEyt + BEy;
    }

    return BEyt * baseline.py * 0.000001;
  }

  public d_pe_fuel(project: projecteDto) {
    let pefcy = 0;
    let tpefcy = 0;
    let efkmzy = 0;
    let tefkmkzy = 0;

    for (const n in project.vehicle) {
      // trunk buses and feeder buses

      if (
        (project.vehicle[n].fuel.type == 'LNG' ||
          project.vehicle[n].fuel.type == 'FFF') &&
        project.vehicle[n].fuel.type != 'Electricity' &&
        project.vehicle[n].type != 'Cars(Indirect)' &&
        project.vehicle[n].type != 'Buses(Indirect)' &&
        project.vehicle[n].type != 'Taxis(Indirect)'
      ) {
        //direct PE from Fuel

        if (project.vehicle[n].fcpjny) {
          //check if have total fuel consumption
          if (project.vehicle[n].fuel.pn) {
            pefcy =
              project.vehicle[n].fcpjny *
              project.vehicle[n].fuel.ncv *
              project.vehicle[n].fuel.pn *
              (project.vehicle[n].fuel.efco2 +
                project.gwpch4 * project.vehicle[n].fuel.efch4n) *
              0.000001;

            tpefcy += pefcy;
          } else {
            pefcy =
              project.vehicle[n].fcpjny *
              project.vehicle[n].fuel.ncv *
              (project.vehicle[n].fuel.efco2 +
                project.gwpch4 * project.vehicle[n].fuel.efch4n) *
              0.000001;

            tpefcy += pefcy;
          }
        } else {
          if (project.vehicle[n].efkmzy) {
            efkmzy = project.vehicle[n].efkmzy;

            tefkmkzy += efkmzy;
          } else {
            if (project.vehicle[n].fuel.pn) {
              efkmzy =
                project.vehicle[n].sfczny *
                project.vehicle[n].fuel.ncv *
                project.vehicle[n].fuel.pn *
                (project.vehicle[n].fuel.efco2 +
                  project.gwpch4 * project.vehicle[n].fuel.efch4n) *
                1000;
              tefkmkzy += efkmzy;
            } else {
              efkmzy =
                project.vehicle[n].sfczny *
                project.vehicle[n].fuel.ncv *
                (project.vehicle[n].fuel.efco2 +
                  project.gwpch4 * project.vehicle[n].fuel.efch4n) *
                1000;

              tefkmkzy += efkmzy;
            }
          }

          tpefcy = project.vehicle[n].ddzy * tefkmkzy * 0.000001;
        }
      } else if (
        (project.vehicle[n].fuel.type == 'Diesel' ||
          project.vehicle[n].fuel.type == 'Petrol') &&
        (project.vehicle[n].type != 'Cars(Indirect)' ||
          project.vehicle[n].type != 'Buses(Indirect)' ||
          project.vehicle[n].type != 'Taxis(Indirect)')
      ) {
        if (project.vehicle[n].fuel.pn) {
          pefcy =
            (project.vehicle[n].fcpjny *
              project.vehicle[n].fuel.wciy *
              project.vehicle[n].fuel.pn *
              44) /
            12;
        } else if (
          project.vehicle[n].fuel.ncv &&
          project.vehicle[n].fuel.efco2
        ) {
          pefcy =
            project.vehicle[n].fcpjny *
            project.vehicle[n].fuel.ncv *
            project.vehicle[n].fuel.efco2;
        } else {
          pefcy =
            (project.vehicle[n].fcpjny * project.vehicle[n].fuel.wciy * 44) /
            12;
        }

        tpefcy += pefcy;
      }
    }

    if (tpefcy) {
      return tpefcy;
    } else {
      return 0;
    }
  }

  public d_pe_elec(project: projecteDto) {
    let peecy = 0;
    let tpeecy = 0;
    let ecpjjy = 0;

    for (const m in project.vehicle) {
      if (project.vehicle[m].fuel.type == 'Electricity') {
        //calculate EFefjy
        if (project.vehicle[m].fcpjny) {
          ecpjjy = project.vehicle[m].fcpjny;
        } else {
          ecpjjy = project.vehicle[m].sfczny * project.vehicle[m].ddzy * 0.001;
        }
        peecy =
          ecpjjy *
          project.vehicle[m].fuel.efefjy *
          (1 + project.vehicle[m].fuel.tdljy * 0.01);

        tpeecy = +peecy;
      }
    }
    if (tpeecy) {
      return tpeecy;
    } else {
      return 0;
    }
  }

  public i_pe(project: projecteDto, baseline: baselineDto) {
    let ipe = 0;
    let tipe = 0;
    let Tipe = 0;
    for (const m in project.vehicle) {
      if (
        project.vehicle[m].type == 'Cars(Indirect)' ||
        project.vehicle[m].type == 'Buses(Indirect)' ||
        project.vehicle[m].type == 'Taxis(Indirect)'
      ) {
        //only indirect vehicles

        if (project.vehicle[m].efkmzy) {
          ipe = project.vehicle[m].ddzy * project.vehicle[m].efkmzy * 0.000001;
          tipe += ipe;
        } else {
          ipe =
            project.vehicle[m].ddzy *
            project.vehicle[m].efkmix *
            project.vehicle[m].p *
            0.000001;
          tipe += ipe;
        }
      }
    }

    Tipe = tipe * project.py;

    if (Tipe) {
      return Tipe;
    } else {
      return 0;
    }
  }

  public async leakageEmission(base: baselineDto, pro: projecteDto) {
    const unit = 1000000;
    let LE = 0;
    let LE_lfz = 0;
    let LE_lft = 0;
    let LE_cong = 0;
    let LE_up = 0;

    let LE_reb = 0;
    let LE_spy = 0;
    let ars_y = 0;

    for await (const vehi of pro.vehicle) {
      for await (const baseVehi of base.vehicle) {
        if (
          (vehi.type == 'Cars(Indirect)' && baseVehi.type == 'Car(fuel)') ||
          (vehi.type == 'Buses(Indirect)' && baseVehi.type == 'Bus(fuel)') ||
          (vehi.type == 'Taxis(Indirect)' && baseVehi.type == 'Taxi(fuel)')
        ) {
          if (vehi.type == 'Buses(Indirect)') {
            let srs = pro.leakege.src;
            if (srs == undefined || srs == null || !pro.leakege.src) {
              srs =
                (pro.leakege.dd_zx * 2.5) /
                (pro.leakege.dd_zx * 2.5 +
                  pro.leakege.dd_tx +
                  pro.leakege.dd_cx);
            }

            const ars =
              (pro.leakege.bscr / vehi.nzx) * srs -
              (pro.leakege.rsx - pro.leakege.rsy) / pro.leakege.rsx;
            ars_y += ars;
          }
        }
      }
    }

    for (const projectVehi of pro.vehicle) {
      for await (const baseVehi of base.vehicle) {
        if (
          (projectVehi.type == 'Cars(Indirect)' &&
            baseVehi.type == 'Car(fuel)') ||
          (projectVehi.type == 'Buses(Indirect)' &&
            baseVehi.type == 'Bus(fuel)') ||
          (projectVehi.type == 'Taxis(Indirect)' &&
            baseVehi.type == 'Taxi(fuel)')
        ) {
          const roc_iy = projectVehi.or / projectVehi.cv; //project Average occupancy rate relative to capacity in category i in year y
          const roc_ix = baseVehi.or / baseVehi.cv; //baseline
          const ef = projectVehi.efkmzy;
          let nisy = projectVehi.nisy;
          let vd = baseVehi.ddzy;

          if (vd == null || vd == undefined || !projectVehi.ddzy) {
            vd = (baseVehi.dd_l * baseVehi.dd_m * baseVehi.dd_s) / baseVehi.nzx;
          }
          if (nisy == null || nisy == undefined || !projectVehi.nisy) {
            nisy = (projectVehi.ms * base.py) / projectVehi.or;
          }
          if (ef == null || ef == undefined || !projectVehi.efkmzy) {
          }
          if (
            ars_y <= 0 &&
            (projectVehi.type == 'Cars(Indirect)' ||
              projectVehi.type == 'Taxis(Indirect)')
          ) {
            const le_reb =
              (projectVehi.ddzy *
                ef *
                (projectVehi.nzx - baseVehi.nzx + nisy)) /
              unit;
            const efbe = this.be(ef, baseVehi.v, projectVehi.v);
            const le_sp =
              (projectVehi.ddzy * projectVehi.n * (ef - efbe)) / unit;

            LE_reb += le_reb;
            LE_spy += le_sp;
          }

          if (projectVehi.type == 'Buses(Indirect)') {
            if (roc_ix - roc_iy <= 0.1) {
              LE_lfz = 0;
            } else {
              const le =
                (ef * vd * projectVehi.nzx * (1 - roc_iy / roc_ix)) / unit;
              LE_lfz = Math.max(le, 0);
            }
          }
          if (projectVehi.type == 'Taxis(Indirect)') {
            if (roc_ix - roc_iy <= 0.1) {
              LE_lft = 0;
            } else {
              const le =
                (ef * vd * projectVehi.nzx * (1 - roc_iy / roc_ix)) / unit;
              LE_lft = Math.max(le, 0);
            }
          }
        }
      }
    }

    const LE_upA = 0; //await (this.pro_FC - this.base_FC);
    if (ars_y > 0) {
      LE_cong = 0;
    }

    if (ars_y <= 0) {
      const le = LE_reb + LE_spy;
      LE_cong = Math.max(le, 0);
    }

    LE_up = Math.max(LE_upA, 0);
    LE = LE_cong + LE_lft + LE_lfz + LE_up;
    return LE;
  }
  public be(ef: number, vb: number, vp: number) {
    const v = Math.pow(vp / vb, -0.7);

    return ef / v;
  }
}
