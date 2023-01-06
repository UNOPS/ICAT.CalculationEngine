import { FuelDto } from "./fuel.dto";


export class LeakageDto{
    year: number;
    fuel: FuelDto[];
    lebr: number; //Leakage emissions from displacement of existing uses of waste oil/fat or biomass residues in year y (tCO2)
    ncvbf: number;
}