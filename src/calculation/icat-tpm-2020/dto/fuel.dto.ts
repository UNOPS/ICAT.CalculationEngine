export class FuelDto {

    type: string;

    density: number;  // Density of Fuel i (Kg/m3)

    ncv: number;  // Net calorific value of fuel i  (TJ/t)

    ef: number; // CO2 emission factor of fuel (t-CO2/TJ) ||(kgCO2/kwh)

    sfc: number; // Specific Fuel Consumption (l/km) ||(kwh/km)

    fuelShare:number; //(%)

    vkt : number;

    fc:number;
    used_liters:number;
    used_weight:number;

    fuelPrice:number;
    priceElasticity:number;
    crosePriseElasticity:number;
    priceIncrease:number;

    efco2xy:number;


    efco2:number;
    ecblky:number;
    efefjy:number;
    tdlky:number;
    tdljy:number;

    pn:number;
    wciy:number;
    efch4n:number
}