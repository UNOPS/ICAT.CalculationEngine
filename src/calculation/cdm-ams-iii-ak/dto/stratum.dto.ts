export class StratumDto{
    type: string;
     /** projectDto */
     asoc: number; //Area of land stratum i (ha)
     socref: number; // Reference SOC stock applicable to land stratum i
     flub: number; // Reletive stock change factor for land-use in the basline in stratum i
     fmgb: number; // Relative stock change factor for land management in the baseline stratum i
     finb: number; // Relative stock change factor for input in the baseline stratum i
     flup: number; // Reletive stock change factor for land-use in the project in stratum i
     fmgp: number; // Relative stock change factor for land management in the project stratum i
     finp: number; // Relative stock change factor for input in the project stratum i
     afr: number; // Area of stratum i of land subjected to clearance or fire in year
     b: number; // Fuel biomass consumption per hectare in sratum i of land subjected to clearance or fire
     r: number; // Root-shoot ratio for sratum i of land subjected to clearance or fire

}