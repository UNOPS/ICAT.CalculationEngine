import { Module } from '@nestjs/common';
import { JicaTcmMsPV3Controller } from './jica-tcm-ms-p-v-3.controller';
import { JicaTcmMsPV3Service } from './jica-tcm-ms-p-v-3.service';

@Module({
    controllers: [JicaTcmMsPV3Controller],
    providers: [JicaTcmMsPV3Service],
    exports: [JicaTcmMsPV3Service]
})
export class JicaTcmMsPV3Module {}

