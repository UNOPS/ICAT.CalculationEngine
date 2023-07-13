import { Module } from "@nestjs/common";
import { JicaRailwayFreightService } from "./jica-railway-freight.service";

@Module({
    controllers: [],
    providers: [JicaRailwayFreightService],
    exports: [JicaRailwayFreightService]
})
export class JicaRailwayFreight {}