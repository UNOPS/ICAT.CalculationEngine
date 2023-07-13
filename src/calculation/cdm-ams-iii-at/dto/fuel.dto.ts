export class FuelDto{
    type: string;

    /*baseline*/
    ncv: number; //Net calorific value of fuel j of commercial passenger transport/freight vehicle (MJ/t, MJ/Unit qty of fuel)   
    efco2: number; //CO2 emission factor of fuel j of commercial passenger transport vehicle (tCO2/MJ)tCO2/energy content of fuel, country specific data or IPCC default value) 
}