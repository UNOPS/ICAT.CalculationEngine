

export class FuelDto{
    type: string;

    /** baselineDto */
    efco2: number; //Carbon dioxide emissions factor for displaced fossil fuel (tCO2/GJ)
    cbf: number; //  Quantity of biofuel type i consumed/sold/blended in year y (t)
    fpj: number; // Fraction of biofuel in the blended biofuel type i in year y (ratio)
    freg: number; /*  Fraction of biofuel in the blended biofuel which is required by mandatory
                    regulations of the host country in year y (ratio) */

    /*projectDto*/
    fuelConsumption: number; // Quantity of methanol consumed in the biodiesel plant, including spills and evaporations on-site in year y (tMeOH)
    efcmeoh: number; //  Carbon emissions factor of methanol, based on molecular weight (tC/tMeOH)

    /** leakageDto */
    efmeoh: number; // Pre-combustion emissons factor for methanol production
    efijx: number; /*Emission factor for upstream emissions stage i associated with consumption of fossil fuel type x from fossil 
                    fuel origin j applicable to year y (t CO2e/TJ)*/
    
}