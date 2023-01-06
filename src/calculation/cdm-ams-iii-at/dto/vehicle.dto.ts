import { FuelDto } from "./fuel.dto";

export class VehicleDto{
    type: string;
    fuel: FuelDto[];

    /*baseline*/
    //freight vehicles
    dfv: number; //Total annual distance travelled by each vehicle i under baseline conditions (km) 
    pfvb: number; //Total annual weight of goods transported by each freight vehicle i under baseline 
    pfv: number; // Total annual weight of goods transported by each project freight vehicle i in year y on each traceable route (tonnes) 
    dpfvb: number; // The annual average distance of transportation per tonne of freight by each freight  under baseline conditions
    dpfv: number; // Annual average distance of transportation per tonne of goods by freight vehicle i

    //passenger vehicles
    npv: number; // Number of operating project commercial passenger transport vehicle i in the year y  
    adpv: number; //Annual average distance of project commercial passenger transport vehicle i in year y (km)

    nbl: number; //Fuel efficiency of baseline commercial passenger transport vehicle i in the year y 

    /*Project*/
    //freight vehicles
    fcfv: number; //Consumption of fuel j by freight vehicle i in year y (quantity of fuel)
     //passenger vehicles
    fcpv: number; // Consumption of fuel j by commercial passenger transport vehicle i in year y (quantity of fuel)



}