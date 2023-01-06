import { CdmAcm0017ReqMsg } from "../message/cdm-acm0017-req-msg";


export class ResponseDto{
    year:number;
    baseLineEmission : number;
    projectEmission : number;
    leakageEmission: number;
    emissionReduction : number;
    meta_data : CdmAcm0017ReqMsg;
}