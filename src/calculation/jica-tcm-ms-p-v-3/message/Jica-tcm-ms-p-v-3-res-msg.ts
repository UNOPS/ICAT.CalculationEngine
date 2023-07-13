
import { Injectable } from "@nestjs/common";
import { BaseResponseMsg } from "./baseResponseMsg";
import { JicaTcmMsPV3ReqMsg } from "./Jica-tcm-ms-p-v-3-req-msg";

@Injectable()
export class JicaTcmMsPV3ResMsg extends BaseResponseMsg{

    metaData:JicaTcmMsPV3ReqMsg;
    response= new Array();


}