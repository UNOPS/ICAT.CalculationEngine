import { JicaTcmMsPV3ReqMsg } from "../message/Jica-tcm-ms-p-v-3-req-msg";

export class ResponseDto{

    
    year:number;

    baseLineEmission : number;
    projectEmission : number;

    emissionReduction : number;

    meta_data : JicaTcmMsPV3ReqMsg;
}