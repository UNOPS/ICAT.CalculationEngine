import { FuelDto } from "./fuel.dto";

export class PowerPlantDto{
    type: string;
    /** baselineDto */
    fuel: FuelDto;
    ncvbf: number; //Net calorific value of biofuel produced for the year y (GJ/t)
    pbf: number; //Production of biofuel in the project plant in year y (tonnes)
    pbfsite: number; //Quantity of biofuel consumed at the project plant in year y(tonnes)
    pbfother: number; /* Quantity of biofuel that is either produced with other alcohols than
                            methanol from fossil origin or that is produced using other oil
                            seeds or waste oil(s)/fat(s) than those eligible under this
                            methodology according to the applicability conditions*/
    cbf: number; // Consumption of (blended) biofuel from the project plant by the consumer(s) in year y (tonnes)
    fpj: number; // Fraction of blending in year y (volume ratio)
    fff: number; //Blending fraction of fuel used for blending.

    

}