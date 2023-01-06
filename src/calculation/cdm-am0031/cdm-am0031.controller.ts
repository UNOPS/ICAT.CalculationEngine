import { Controller } from "@nestjs/common";
import { CDMAM0031Service } from "./cdm-am0031.service";

@Controller('cdm-am-0031')
export class CdmAm0031Controller {
    constructor(
        public service: CDMAM0031Service
    ) { }
}