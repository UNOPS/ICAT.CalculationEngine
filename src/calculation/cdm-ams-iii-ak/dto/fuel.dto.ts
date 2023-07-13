export class FuelDto{

    type: string;

    /** baselineDto */
    efco2: number;

    /**projectDto */
    pefc: number; /*Project emissions from combustion of fuel type j in the biofuel production plant and the feedstock 
                    processing plant(s) in year y (tCO2)*/
    peec: number; /*Project emissions from electricity consumption in the biofuel production plant and the feedstock 
                    processing plant(s) in year y (tCO2)*/

    fuelConsumption: number; //Quantity of methanol consumed in the biofuel plant, including spills and evaporations in year y (tonnes)
    efcm: number; //Carbon emission factor of methanol, based on molecular weight (tC/t MeOH) 

    pebshf: number; // Project emissions from the consumptions of fuel for biomass seeding and harvesting in year
    pebshe: number; // Project emissions from the consumptions of fuel for biomass seeding and harvesting in year

    /** leakageDto */
    efmeoh: number; // Pre-combustion emissons factor for methanol production
    efijx: number; /*Emission factor for upstream emissions stage i associated with consumption of fossil fuel type x from fossil 
                    fuel origin j applicable to year y (t CO2e/TJ)*/

}