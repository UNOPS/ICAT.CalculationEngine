import { CdmAmsIIIATReqMsg } from "../message/cdm-ams-iii-at-req-msg";


export class ResponseDto{
    year:number;
    baseLineEmission : number;
    projectEmission : number;
    // leakageEmission: number;
    emissionReduction : number;
    meta_data : CdmAmsIIIATReqMsg;
}