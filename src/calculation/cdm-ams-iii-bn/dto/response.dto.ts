import { CdmAmsIiiBnReq } from "../message/cdm-ams-iii-bn-req";

export class ResponseDto {
    year:number;
    baseLineEmission : number;
    projectEmission : number;
    emissionReduction : number;
    meta_data : CdmAmsIiiBnReq;
}
