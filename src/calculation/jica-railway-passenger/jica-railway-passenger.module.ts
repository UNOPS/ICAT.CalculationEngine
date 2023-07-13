import { Module } from "@nestjs/common";
import { JicaRailwayPassengerService } from "./jica-railway-passenger.service";

@Module({
    controllers: [],
    providers: [JicaRailwayPassengerService],
    exports: [JicaRailwayPassengerService]
})
export class JicaRailwayPassenger {}