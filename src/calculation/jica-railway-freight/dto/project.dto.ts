export class ProjectDto {
    year: number;
    ec: number; // : Electricity consumption associated with the operation of the project activity in year y (MWh/y)
    ef: number;
    btkm: number;
    p: number; // : Increased number of passenger by the project activity in year y (passenger/y)
    btdp: number; // Average trip distance of the passenger transportation in the project in year y (km)

    fc: number; //Consumption of fuel i associated with the operation of the railway in year y (t/y)
    ncv: number;
    efpkm: number;
}
