

export class StratumDto{
    type: string;

    /*projectDto*/
    asoc: number; // Area of land stratum (ha)
    socref: number; // Reference SOC stock applicable to land stratum
    flub: number; // Relative stock change factor for land-use in the baseline in stratum
    fmgb: number; // Relative stock change factor for land management in the baseline in stratum
    finb: number; // Relative stock change factor for input in the baseline in stratum
    flup: number; // Relative stock change factor for land-use in the project in stratum
    fmgp: number;// Relative stock change factor for land management in the project in stratum
    finp: number; // Relative stock change factor for input in the project in stratum
}