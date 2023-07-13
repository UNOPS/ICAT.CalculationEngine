import { Module } from "@nestjs/common";
import { AM0110VE02Service } from "./am00110_ve02.service";

@Module({
    controllers: [],
    providers: [AM0110VE02Service],
    exports: [AM0110VE02Service]
})
export class am0110VE02Module {}