import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { ProjectTypeEnum } from "src/calculation/enum/project_type.enum";
import { SelectApproch } from "src/calculation/icat-tpm-2020/dto/selectApproch.dto";
import { IcatTpm2020Service } from "src/calculation/icat-tpm-2020/icat-tpm-2020.service";
import { IcatTpm2020request } from "src/calculation/icat-tpm-2020/message/calculation-request-msg";
import { UnfccAmsIIIBcReqMsg } from "src/calculation/unfccc-ams-iii-bc/message/unfccc-ams-iii-bc-req-msg";
import { UnfcccAmsIiiBcService } from "src/calculation/unfccc-ams-iii-bc/unfccc-ams-iii-bc.service";
import { icatCATResponceMsg } from "src/calculation/icat-tpm-2020/message/calculation-response-msg";
import { JicaTcmMsPV3Service } from "src/calculation/jica-tcm-ms-p-v-3/jica-tcm-ms-p-v-3.service";
import { JicaTcmMsPV3ReqMsg } from "src/calculation/jica-tcm-ms-p-v-3/message/Jica-tcm-ms-p-v-3-req-msg";
import { ProjectionService } from "src/calculation/projection/projection.service";
import { UnfcccAmsIIIC15ReqMsg } from "src/calculation/unfccc-ams-iii-c-15/message/unfccc-ams-iii-c-15-req-msg";
import { UnfcccAmsIiiC15Service } from "src/calculation/unfccc-ams-iii-c-15/unfccc-ams-iii-c-15.service";
import { UnfcccAmsIIISV4RequestMsg } from "src/calculation/unfccc-ams-iii-s-v-4/message/unfccc-ams-iii-s-v-4-req-msg";
import { UnfcccAmsIIISV4Service } from "src/calculation/unfccc-ams-iii-s-v-4/unfccc-ams-iii-s-v-4.service";
import { ResponseDTO } from "./dto/response.dto";
import { Methodology } from "./enitity/methodology.entity";
import { MethodologyService } from "./methodology.service";
import { UnfcccAm0090V0110ReqMsg } from "src/calculation/unfccc_am0090_v_01_1_0/message/unfccc_am0090_v_01_1_0_req_msg";
import { UnfcccAm0090V0110Service } from "src/calculation/unfccc_am0090_v_01_1_0/unfccc_am0090_v_01_1_0.service";
import { UnfcccAm0016V5Service } from "src/calculation/unfccc-am0016-v-5/unfccc-am0016-v-5.service";
import { UnfcccAm0016V5ReqMsg } from "src/calculation/unfccc-am0016-v-5/message/unfccc-am0016-v-5-req-msg";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { JicaRailwayFreightReqMsg } from "src/calculation/jica-railway-freight/message/req.msg";
import { JicaRailwayFreightService } from "src/calculation/jica-railway-freight/jica-railway-freight.service";
import { JicaRailwayPassengerReqMsg } from "src/calculation/jica-railway-passenger/message/req.msg";
import { JicaRailwayPassengerService } from "src/calculation/jica-railway-passenger/jica-railway-passenger.service";
import { Am0110ReqMsg } from "src/calculation/am0110_ve02.0/message/am0110_ve02-req-msg";
import { AM0110VE02Service } from "src/calculation/am0110_ve02.0/am00110_ve02.service";
import { ApiHeader } from "@nestjs/swagger";
import { Console } from "console";
import { CdmAmsIiiAkReqMsg } from "src/calculation/cdm-ams-iii-ak/message/cdm-ams-iii-ak-req-msg";
import { CdmAmsIiiAkService } from "src/calculation/cdm-ams-iii-ak/cdm-ams-iii-ak.service";
import { CdmAcm0017ReqMsg } from "src/calculation/cdm-acm0017/message/cdm-acm0017-req-msg";
import { CdmAcm0017Service } from "src/calculation/cdm-acm0017/cdm-acm0017.service";
import { CdmAm0031ReqMsg } from "src/calculation/cdm-am0031/massage/adm-am0031-req-msg";
import { CdmAmsIIIATReqMsg as CdmAmsIIIATReqMsg } from "src/calculation/cdm-ams-iii-at/message/cdm-ams-iii-at-req-msg";
import { CdmAmsIIIATService } from "src/calculation/cdm-ams-iii-at/cdm-ams-iii-at.service";
import { CdmAmsIiiBnService } from "src/calculation/cdm-ams-iii-bn/cdm-ams-iii-bn.service";
import { CdmAmsIiiBnReq as CdmAmsIIIBNReqMsg } from "src/calculation/cdm-ams-iii-bn/message/cdm-ams-iii-bn-req";
import { CDMAM0031Service } from "src/calculation/cdm-am0031/cdm-am0031.service";
@Crud({
    model: {
        type: Methodology,
    },
    query: {
        join: {
            country: {
                eager: true,
            },
            mitigationActionType: {
                eager: true,
            },
            applicability: {
                eager: true,
            },
            sector: {
                eager: true,
            },
            method: {
                eager: true,
            },
        },
    },
})

@Controller('methodology')



export class MethodologyController {

    constructor(
        public service: MethodologyService,
        public ams_iii_s: UnfcccAmsIIISV4Service,
        public icat: IcatTpm2020Service,
        public ams_iii_bc: UnfcccAmsIiiBcService,
        public projection: ProjectionService,
        public jica: JicaTcmMsPV3Service,
        public mas_iii_c: UnfcccAmsIiiC15Service,
        public am0090: UnfcccAm0090V0110Service,
        public amc0016: UnfcccAm0016V5Service,
        public jaca_freight: JicaRailwayFreightService,
        public jaca_passenger: JicaRailwayPassengerService,
        public am01100: AM0110VE02Service,
        public amsiiiak: CdmAmsIiiAkService,
        public acm0017: CdmAcm0017Service,
        public amsiiiat: CdmAmsIIIATService,
        public amsiiibn: CdmAmsIiiBnService,
        public cdmam0031: CDMAM0031Service,
    ) {
    }

    @Get("")
    public async getall() {
        return this.service.getdatails()
        // return details
    }

    @Post()

    public async createUnit(@Body() req: Methodology) {
        console.log(req);
        this.service.crete(req)
    }

    @UseGuards(LocalAuthGuard)
    @Post('calculation')
    public async cal(@Body() requstpull: any) {

        // console.log("reqpull----------", requstpull)
     //console.log("reqpullbdoy----------", requstpull.body)
   let req = JSON.parse(requstpull.body);


    // let req = requstpull;

        let methodologyCode = req[0]['methodologyCode'];
        let methnum = 0
        while (methodologyCode == null) {
            methodologyCode = req[methnum]['methodologyCode'];
            methnum++;
        }

        console.log("methCode------", methodologyCode)

        const methodologyVersion = req[0]['methodologyVersion'];
        const year = req[0]['AssessmentYear']
        let response = new ResponseDTO;

        if (methodologyCode == "cdm_ams_iii_s" && methodologyVersion == 1) {

            let request = new UnfcccAmsIIISV4RequestMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");

            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");

            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");


            let route = this.service.selectArray(req, "route");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");
            console.log("baselineVehicle======", projectVehicle)
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");


            request.baseline = this.service.assignParameter(baselineArray, baselineVehicle, baselineFuel, year) //(baseEmission)
            request.project = this.service.assignParameter(projectArray, projectVehicle, projectFuel, year);

            // return request
            let dd = this.ams_iii_s.ghgEmission(request);
           //  return request


            response.year = (dd[0]["year"]);

            response.baseLineEmission = dd[0]["baseLineEmission"];

            response.projectEmission = dd[0]["projectEmission"];

            response.leakegeEmission = dd[0]["leakegeEmission"];

            response.emissionReduction = dd[0]["emissionReduction"];

        }

        else if (methodologyCode == "AM0110") {
            let request = new Am0110ReqMsg();
            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");
            let baselinerout = this.service.selectParameterArray(baselineArray, "route");

            let baselineFuelData = this.service.fualData(baselineArray, baselineFuel);
            let baseLineVehiDta = this.service.vehicleData(baselineArray, baselineVehicle, baselineFuelData, "check");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");
            let projectrout = this.service.selectParameterArray(projectArray, "route");

            let projectFuelData = this.service.fualData(projectArray, projectFuel);
            let projectVehiDta = this.service.vehicleData(projectArray, projectVehicle, projectFuelData, "check");

            request.baseline = this.service.routDta(baselineArray, baselinerout, baseLineVehiDta, "baseline");
            // return baselinerout;
            request.projectEmission = this.service.routDta(projectArray, projectrout, projectVehiDta, "project");

            let dd = this.am01100.cal(request);
            // return request
            response.year = year;
            response.baseLineEmission = dd.baseLineEmission;
            response.projectEmission = dd.projectEmission;
            response.emissionReduction = dd.emissionReduction;
            console.log("calengineres--", response)
        }

        else if (methodologyCode == "AM0031") {
            let request = new CdmAm0031ReqMsg();
            let proArray = new Array();
            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");
            let baselineFuelData = this.service.fualData(baselineArray, baselineFuel);
            let baseLineVehiDta = this.service.vehicleData(baselineArray, baselineVehicle, baselineFuelData, "check");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");
            let projectFuelData = this.service.fualData(projectArray, projectFuel);
            let projectVehiDta = this.service.vehicleData(projectArray, projectVehicle, projectFuelData, "check");

            let leakageArray = this.service.selectArray(req, "isLekage");
            let leakageDta = this.service.leakageData(leakageArray);

            request.baseline = this.service.assignPar(baselineArray, baseLineVehiDta, methodologyCode, "isBaseline", null);
            request.projectEmission = this.service.assignPar(null, projectVehiDta, methodologyCode, "isProject", leakageDta);
            // return request;
            let dd = this.cdmam0031.cal(request);
            response.baseLineEmission = (await dd).baseLineEmission;
            response.projectEmission = (await dd).projectEmission;
            response.leakegeEmission = (await dd).lecageEmission;
            response.emissionReduction = (await dd).emissionReduction;

            // return request;
        }
        else if (methodologyCode == "UNFCCC_AMS_III_BC" && methodologyVersion == "1") {

            let request1 = new UnfccAmsIIIBcReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");

            var bfuel = this.service.getFuel(req, baselineFuel);

            var pfuel = this.service.getFuel(req, projectFuel);

            request1.baseline = this.service.assignParameter2(baselineArray, baselineVehicle, bfuel, baselineFuel, year) //(baseEmission)

            request1.project = this.service.assignParameter2(projectArray, projectVehicle, pfuel, projectFuel, year);

            var dd = this.ams_iii_bc.ICATM1(request1);

            response.year = (dd[0]["year"]);
            response.baseLineEmission = dd[0]["baselineEmission"];
            response.projectEmission = dd[0]["projectEmission"];
            response.leakegeEmission = dd[0]["leakegeEmission"];
            response.emissionReduction = dd[0]["emissionReduction"];
            console.log("calengineres--", response)
        }

        else if (methodologyCode == "AMS-iii-C") {
            let request = new UnfcccAmsIIIC15ReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");
            // console.log("methCode------", baselineFuel)
            // console.log("methCode------", methodologyCode)
            // console.log("methCode------", baselineVehicle)

            let projectArray = this.service.selectArray(req, "isProject");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");
            request.baseline = this.service.assignParameter(baselineArray, baselineVehicle, baselineFuel, year);
            request.project = this.service.assignParameter(projectArray, projectVehicle, projectFuel, year);

            // return request;
            let dd = this.mas_iii_c.ghgEmission(request);
            // return dd

            response.baseLineEmission = dd.response[0]["baseLineEmission"]

            response.projectEmission = dd.response[0]["projectEmission"];

            response.leakegeEmission = dd.response[0]["leakegeEmission"];

            response.emissionReduction = dd.response[0]["emissionReduction"];

        }

        //AM0090--------------------
        else if (methodologyCode == "UNFCCC_AM0090" && methodologyVersion == "1") {

            let request1 = new UnfcccAm0090V0110ReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");


            let projectArray = this.service.selectArray(req, "isProject");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");

            var bfuel = this.service.getFuel(req, baselineFuel);

            var pfuel = this.service.getFuel(req, projectFuel);


            request1.baseline = this.service.assignParameter_am0090(baselineArray, baselineVehicle, baselineFuel, year);
            request1.project = this.service.assignParameter_am0090_project(projectArray, projectVehicle, projectFuel, year);


            let dd = this.am0090.ICATM2(request1);

            response.year = (dd[0]["year"]);
            response.baseLineEmission = dd[0]["baselineEmission"];
            response.projectEmission = dd[0]["projectEmission"];
            response.leakegeEmission = 0;
            response.emissionReduction = dd[0]["emissionReduction"];
            console.log("calengineres--", response)

        }
        //AM0090--------------------


        //AMC0016-------------------
        else if (methodologyCode == "UNFCCC_AM0016_V_5" && methodologyVersion == "1") {

            let request1 = new UnfcccAm0016V5ReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");

            var bfuel = this.service.getFuel(req, baselineFuel);
            var pfuel = this.service.getFuel(req, projectFuel);


            let leakageArray = this.service.selectArray(req, "isLekage");
            let leakageDta = this.service.leakageData(leakageArray);

            let projectVehiDta = this.service.vehicleDataProject(projectArray, projectVehicle,pfuel, projectFuel, year);


            request1.baseline = this.service.assignParameter_amc0016(baselineArray, baselineVehicle, bfuel, baselineFuel, year);
            request1.project = this.service.assignParProject(projectArray, projectVehiDta, methodologyCode, "isProject", leakageDta);

       //  return request1;

            let dd = await this.amc0016.ICATM3(request1);
            console.log("+++++", dd)
            response.year = (dd[0]["year"]);
            response.baseLineEmission = dd[0]["baselineEmission"];
            response.projectEmission = dd[0]["projectEmission"];
            response.leakegeEmission = 0;
            response.emissionReduction = dd[0]["emissionReduction"];
            // console.log("calengineres--", response)

        }

        //AMC0016-------------------






        else if (methodologyCode == "jica_tcm_ms_p_v_3-trafic" || methodologyCode == "jica_tcm_ms_p_v_3") {

            let request = new JicaTcmMsPV3ReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");

            let prjectFuelDtails = this.service.getFuel(projectArray, projectFuel);
            let traficCongestiondata = this.service.getTraficCongestion(projectArray, projectVehicle);

            request.baselineEmission = this.service.assignParameter(baselineArray, baselineVehicle, baselineFuel, year);
            request.projectEmission = this.service.assignParameterJicaProject(projectArray, traficCongestiondata, prjectFuelDtails, year, methodologyCode);

            // return request;
            let result = this.jica.modalShift(request);
            // return result
            response.baseLineEmission = result.response[0].baseLineEmission;
            response.leakegeEmission = result.response[0].leakegeEmission;
            response.projectEmission = result.response[0].projectEmission;
            response.emissionReduction = result.response[0].emissionReduction;
            // return result.;


        }
        else if (methodologyCode == "jica_railway_fr_modal") {
            let request = new JicaRailwayFreightReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");

            let projectArray = this.service.selectArray(req, "isProject");

            request.baselineEmission = this.service.assignParameter0(baselineArray, baselineVehicle, year, methodologyCode);
            request.projectEmission = this.service.assignpara(projectArray, year);
            // return request;
            let re = this.jaca_freight.cal(request);

            response.baseLineEmission = re.baseLineEmission;
            response.projectEmission = re.projectEmission;
            response.emissionReduction = re.emissionReduction;
        }

        else if (methodologyCode == "jica_railway_fr_electric") {
            let request = new JicaRailwayFreightReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");

            let projectArray = this.service.selectArray(req, "isProject");

            request.baselineEmission = this.service.assignParameter1(baselineArray, baselineVehicle, baselineFuel, year, methodologyCode);
            request.projectEmission = this.service.assignpara(projectArray, year);
            // return request;
            let re = this.jaca_freight.cal(request);

            response.baseLineEmission = re.baseLineEmission;
            response.projectEmission = re.projectEmission;
            response.emissionReduction = re.emissionReduction;


        }

        else if (methodologyCode == "jica_railway_pass_modal" || methodologyCode == "jica_railway_pass_electric") {
            let request = new JicaRailwayPassengerReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");

            let projectArray = this.service.selectArray(req, "isProject");

            request.baselineEmission = this.service.assignParameter1(baselineArray, baselineVehicle, baselineFuel, year, methodologyCode);
            request.projectEmission = this.service.assignpara(projectArray, year);

            let re = this.jaca_passenger.cal(request);
            // return request;
            response.baseLineEmission = re.baseLineEmission;
            response.projectEmission = re.projectEmission;
            response.emissionReduction = re.emissionReduction;


        }

        else if (methodologyCode == "ICAT_TPM_FSR_2020_A" || methodologyCode == "ICAT_TPM_FSR_2020_B") {
            let requestICAT = new IcatTpm2020request();
            let baseLineApproch = new SelectApproch();
            if (methodologyCode == "ICAT_TPM_FSR_2020_A") {
                baseLineApproch.baseLineApproch = ProjectTypeEnum.baseLineApproch_A;
                baseLineApproch.projectApproch = ProjectTypeEnum.projectApproch_A;
            }
            else if (methodologyCode == "ICAT_TPM_FSR_2020_B") {
                baseLineApproch.baseLineApproch = ProjectTypeEnum.baseLineApproch_B;
                baseLineApproch.projectApproch = ProjectTypeEnum.projectApproch_B;
            }

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            console.log(baselineFuel)

            let route = this.service.selectArray(req, "route");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");

            requestICAT.projectType = baseLineApproch;

            let fuel = this.service.getFuel(req, projectFuel);
            requestICAT.baseline = this.service.assignParameterICATbaseline(req, baselineFuel)
            requestICAT.project = this.service.assignParameterICATproject(projectArray, year, fuel);
            // return requestICAT
            let re = new icatCATResponceMsg();
            re = await this.icat.calculate(requestICAT);

            response.baseLineEmission = re.baseLineEmission;
            response.leakegeEmission = re.leakegeEmission;
            response.projectEmission = re.projectEmission;
            response.emissionReduction = re.emissionReduction;

        }

        else if (methodologyCode === "ICAT_TPM_FSR_2020_C" || methodologyCode === "ICAT_TPM_RP_2020_cordon" || methodologyCode === "ICAT_TPM_RP_2020_Toll_roads") {
            let requestICAT = new IcatTpm2020request();
            let approch = new SelectApproch();

            if (methodologyCode == "ICAT_TPM_FSR_2020_C") {
                approch.baseLineApproch = ProjectTypeEnum.baseLineApproch_C;
                approch.projectApproch = ProjectTypeEnum.projectApproch_C;
            }
            else if (methodologyCode == "ICAT_TPM_RP_2020_cordon") {
                approch.baseLineApproch = ProjectTypeEnum.baseLineApproch_C;
                approch.projectApproch = ProjectTypeEnum.cordonPricing;
            }
            else if (methodologyCode == "ICAT_TPM_RP_2020_Toll_roads") {
                approch.baseLineApproch = ProjectTypeEnum.baseLineApproch_C;
                approch.projectApproch = ProjectTypeEnum.roadpricingSimlified;
            }


            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");

            let fuel = this.service.getFuel(req, baselineFuel);
            let fuelpr = this.service.getFuel(req, projectFuel);
            requestICAT.projectType = approch;
            requestICAT.baseline = this.service.assignParameterICAT(req, baselineVehicle, fuel, baselineFuel, year)
            requestICAT.project = this.service.assignParameterICATproject(projectArray, year, fuelpr);
            // return requestICAT;
            let re = new icatCATResponceMsg();
            re = await this.icat.calculate(requestICAT);
            // return requestICAT;
            response.baseLineEmission = re.baseLineEmission;
            response.leakegeEmission = re.leakegeEmission;
            response.projectEmission = re.projectEmission;
            response.emissionReduction = re.emissionReduction;
        }

        else if (methodologyCode === "ICAT_TPM_VPI_2020") {
            let requestICAT = new IcatTpm2020request();
            let approch = new SelectApproch();
            if (methodologyCode == "ICAT_TPM_VPI_2020") {
                approch.baseLineApproch = ProjectTypeEnum.baseLineApproch_C;
                approch.projectApproch = ProjectTypeEnum.simplified;
            }


            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");

            let fuel = this.service.getFuel(req, baselineFuel);
            let fuelpr = this.service.getFuel(req, projectFuel);
            requestICAT.projectType = approch;
            requestICAT.baseline = this.service.assignParameterICAT(baselineArray, baselineVehicle, fuel, baselineFuel, year)
            requestICAT.project = this.service.assignParameterICATSim(projectArray, projectVehicle, fuelpr, projectFuel, year)

            let re = new icatCATResponceMsg();
            re = await this.icat.calculate(requestICAT);
            response.baseLineEmission = re.baseLineEmission;
            response.leakegeEmission = re.leakegeEmission;
            response.projectEmission = re.projectEmission;
            response.emissionReduction = re.emissionReduction;
        }

        else if (methodologyCode === "CDM_AMS_III_AK_A" || methodologyCode === "CDM_AMS_III_AK_B") {
            let request = new CdmAmsIiiAkReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselinePowerplant = this.service.selectParameterArray(baselineArray, "powerPlant");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectFeedstock = this.service.selectParameterArray(projectArray, "feedstock");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehicle");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");
            let projectSoil = this.service.selectParameterArray(projectArray, "soil");
            let projectStratum = this.service.selectParameterArray(projectArray, "stratum");

            let leakageArray = this.service.selectArray(req, "isLekage");
            let leakageFuel = this.service.selectParameterArray(leakageArray, "fuelType");
            let leakageResidue = this.service.selectParameterArray(leakageArray, "residue");


            request.baseline = this.service.assignParameters_AMSIIIAK1(baselineArray, baselineFuel, baselinePowerplant, year);
            request.project = this.service.assignParameters_AMSIIIAK2(projectArray, projectFeedstock, projectVehicle,
                projectFuel, projectSoil, projectStratum, year);
            request.leakage = this.service.assignParameters_AMSIIIAK3(leakageArray, leakageFuel, leakageResidue, year);

            let dd = this.amsiiiak.AMSIIIEmission(request)

            response.baseLineEmission = dd.response[0]["baseLineEmission"]
            response.projectEmission = dd.response[0]["projectEmission"];
            response.leakegeEmission = dd.response[0]["leakageEmission"];
            response.emissionReduction = dd.response[0]["emissionReduction"];

            console.log("response", response)

        }
        else if (methodologyCode === "CDM_ACM0017") {
            let request = new CdmAcm0017ReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselinePowerplant = this.service.selectParameterArray(baselineArray, "powerPlant");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectPowerplant = this.service.selectParameterArray(projectArray, "powerplant");
            let projectFeedstock = this.service.selectParameterArray(projectArray, "feedstock");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");
            let projectStratum = this.service.selectParameterArray(projectArray, "stratum");

            let leakageArray = this.service.selectArray(req, "isLekage");
            let leakageFuel = this.service.selectParameterArray(leakageArray, "fuelType");

            request.baseline = this.service.assignParameters_ACM0017_1(baselineArray, baselineFuel, baselinePowerplant, year);
            request.project = this.service.assignParameters_ACM0017_2(projectArray, projectFuel, projectPowerplant, projectFeedstock, projectStratum, year);
            request.leakage = this.service.assignParameters_ACM0017_3(leakageArray, leakageFuel, year);

            let dd = this.acm0017.ACM0017Emission(request)

            response.baseLineEmission = dd.response[0]["baseLineEmission"]
            response.projectEmission = dd.response[0]["projectEmission"];
            response.leakegeEmission = dd.response[0]["leakageEmission"];
            response.emissionReduction = dd.response[0]["emissionReduction"];

        }

        else if (methodologyCode === "CDM_AMS_III_AT") {
            let request = new CdmAmsIIIATReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");

            request.baseline = this.service.assignParameters_AMSIIIAT(baselineArray, baselineFuel, baselineVehicle, year, true);
            request.project = this.service.assignParameters_AMSIIIAT(projectArray, projectFuel, projectVehicle, year);

            let dd = this.amsiiiat.AMSIIIATEmission(request)

            response.baseLineEmission = dd.response[0]["baseLineEmission"]
            response.projectEmission = dd.response[0]["projectEmission"];
            response.emissionReduction = dd.response[0]["emissionReduction"];
        }

        else if (methodologyCode === "CDM_AMS_III_BN") {
            let request = new CdmAmsIIIBNReqMsg();

            let baselineArray = this.service.selectArray(req, "isBaseline");
            let baselineFuel = this.service.selectParameterArray(baselineArray, "fuelType");
            let baselineVehicle = this.service.selectParameterArray(baselineArray, "vehical");
            let baselineRoute = this.service.selectParameterArray(baselineArray, "route");

            let projectArray = this.service.selectArray(req, "isProject");
            let projectFuel = this.service.selectParameterArray(projectArray, "fuelType");
            let projectVehicle = this.service.selectParameterArray(projectArray, "vehical");
            let projectRoute = this.service.selectParameterArray(projectArray, "route");

            request.baseline = this.service.assignParameters_AMSIIIBN_1(baselineArray, baselineVehicle, baselineFuel, baselineRoute, year);
            request.project = this.service.assignParameters_AMSIIIBN_1(projectArray, projectVehicle, projectFuel, projectRoute, year, true);

            let dd = this.amsiiibn.AMSIIIBNEmission(request)

            response.baseLineEmission = dd.response[0]["baseLineEmission"]
            response.projectEmission = dd.response[0]["projectEmission"];
            response.emissionReduction = dd.response[0]["emissionReduction"];
        }


        var projectionArray = this.service.selectProjectionArray(req, "isProjection");
        var baseMile = this.service.selectMile(req, "isProjection");

        var projectionRequest = this.service.projection(projectionArray, response.baseLineEmission, response.projectEmission, response.leakegeEmission, baseMile);
        response.projectionResults = this.projection.projection(projectionRequest);

        console.log("response========", response)
        return response;

    }





}