import { Injectable } from "@nestjs/common";
import { BaseResponseMsg } from "src/calculation/jica-tcm-ms-p-v-3/message/baseResponseMsg";

// @Injectable()
export class icatCATResponceMsg {

    baseLineEmission : number;
    projectEmission : number;
    leakegeEmission : number;
    emissionReduction : number;
    year:number;

}