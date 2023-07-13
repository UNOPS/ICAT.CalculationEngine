export class TraficCongestionDto {
    type:string;
    ms: number; //Share of passengers by transport mode I (Bus) in the project scenario in year y (%)
    or: number; //  Average occupation rate of transport mode I (Bus) (passenger/vehicle)
    efkm: number;//CO2 emission factor of transport mode I (Bus) (t-CO2/km) 
    sfc:number;
}