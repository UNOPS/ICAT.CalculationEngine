export class FuelDto {
  type: string;

  // fuelConsumption: number; //Total amount of fossil fuel type i/electricity consumed by the buses driving in the baseline/project route
  fuelConsumption: number;
  ecConsumption: number;

  ncv: number; //Net calorific value of the fuel type i
  efco2: number;
  tdlgrid: number; //Average technical transmission and distribution losses for providing electricity to grid in the baseline (%)
  efkgrid: number; // CO2 emission factor of the electric grid that supplies electricity to the electric bus (tCO2e/MWh)
}
