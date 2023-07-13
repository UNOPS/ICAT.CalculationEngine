import { Injectable } from "@nestjs/common";

@Injectable()
export class BaseResponseMsg{
     resStatus : number;


     reason : string;
   

     
}