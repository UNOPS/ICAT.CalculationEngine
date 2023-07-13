import { CdmAmsIiiAkReqMsg } from "../message/cdm-ams-iii-ak-req-msg";

export class ResponseDto{
    year:number;
    baseLineEmission : number;
    projectEmission : number;
    leakageEmission: number;
    emissionReduction : number;
    meta_data : CdmAmsIiiAkReqMsg;
}