import { FuelDto } from "./fuel.dto";
import { SoilDto } from "./soil.dto";
import { StratumDto } from "./stratum.dto";
import { VehicleDto } from "./vehicle.dto";

export class FeedstockDto {
    type: string;
    /**projectDto */

    vehicle: VehicleDto[];
    fuel: FuelDto[];
    soil: SoilDto[];
    stratum: StratumDto[];
    peww: number; // Project emissions from anaerobic treatment of waste/waste water in year y (tCO2)
    as: number; // Area in which feedstock type s is cultivated for use in thte project plant in year y (ha)
    efs: number; // Deafault emmission factor (Ass. with cultivation of land)
    t: number; // Length of the first creaditing period of the project in years
    qn: number; // Rate of nitrogen applied in year
    aftm: number; // Area of land subjected to soil fertilization and management in year
    efft: number; //Aggregate emission factor for N2O and CO2 emissions 

    fpbf: number; // Amount of biofuel produced with feedstock type s by the project activity in year
    af2: number; // Allocation factor for the land cultivation of feedstock type s in year

    mpmp: number; // Market price per ton of main product in year
    mmp: number; // Mass of main product
    mpbp: number; // Market price per ton of dry co-product in year
    mbp: number; // Mass of co-product
}