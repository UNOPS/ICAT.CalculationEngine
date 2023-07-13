export class SoilDto{
    type: string;
    /**ProjectDto */
    qsa: number; // Rate of application of soil amendment agent type i in year
    asa: number; // Area of land in which soil amendment agent type i is applied in year
    efsa: number; // Emission factor for CO2 emissions from application of soil amendmnet agent type i
}