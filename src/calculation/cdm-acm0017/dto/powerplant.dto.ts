import { FeedstockDto } from "./feedstock.dto";
import { FuelDto } from "./fuel.dto";
import { StratumDto } from "./stratum.dto";


export class PowerplantDto{
    type: string;
    /** baselineDto */
    fuel: FuelDto[];
    ncvbf: number; //Net calorific value of biofuel produced for the year y (GJ/t)
    pbf: number; //  Quantity of biofuel produced in the project plant in year y (t)
    pbfsite: number; // Quantity of biofuel consumed at the project plant(s) (t)
    pbfother: number; /*  Quantity of biofuel that is either produced with alcohols other than 
                        methanol from fossil origin or produced using feedstock or waste 
                        oil(s)/fat(s) other than those eligible under this methodology according to 
                        the applicability conditions in year y (t)
                        */

    /*projectDto*/
    prfuel: FuelDto;
    feedstock: FeedstockDto[];
    stratum: StratumDto[];

    af1: number; // Allocation factor for the production of biofuel in year
    pebp: number; // Project emissions resulting from the biomass processing facility and from the biodiesel production plant (tCO2e)
    pebt: number; /*Project emissions resulting from the transportation of biomass from the cultivation site to the 
                    biomass processing facility, and from the biomass processing facility to the biodiesel production plant (tCO2e)*/
    af2: number; // Allocation factor for the land cultivation in year y (fraction)

    t: number; // Length of the first crediting period

    
    
}