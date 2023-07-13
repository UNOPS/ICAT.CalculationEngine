import { VehicleTypeEnum } from "../enum/vehicle-type.enum";
import { electrictyDto } from "./electricity.dto";
import { fuelDto } from "./fuel.dto";

export class vehicleDto {

    //type: VehicleTypeEnum;
    type:string

    //----base-line---------
    iri: number;//Technology improvement factor
    di: number; //Average trip distance travelled by passengers 
    si: number; //Share of passengers (%)
    t: number;//Time difference (in years)
    
    sdi: number;//Share of passenger-kilometre
    efpkmix:number;
    efkmi1_4: number;//---<
    nix: number;
   ninx:number;
   sfcinx:number;

   fcpjny:number;
   sfczny:number


    fuel: fuelDto;
    //sfcinx: number;

    pelix:number;
    delix:number;



 




    //Indirect Emission
    //dindi: number;

    ddzy: number;//Total distance driven by project buses in year y (km) or vehicle i



 

    //leakage Emission
    adz: number;


    ddzsx: number;//a
    nzsx: number;//a


    rocz1_4: number;
    roczx: number;

    oczt: number;//a
    cvzt: number;

    oczt1_4: number;//a
    cvzt1_4: number;




    tdi1_4: number;
    ni1_4: number;
    ni1_4_a:number;
    ocix: number;

  
    nimsy: number;

    msi1_4: number;//a
  //  py: number;//a



    efkmvpi1_4: number;//temp 
    efkmvbi: number;//temp


    efkmzy:number;//new added

    efkmix:number
    p:number
  //  ddjny:number;



  nzx: number; //Total number of buses Z in use in year x (units)

  or: number; // e occupancy rate
  cv: number; //Average capacity of a vehicle in vehicle category
  nisy: number;//number of cars and taxis per annum not used anymore due to mode shift to the MRTS 
  ms: number;  // Share of passengers by transport mode

  //d: number; //Total annual distance travelled by each baseline vehicle i (km)

    dd_s: number;//Total distance driven by small (S) buses i in year x (km)
    dd_m: number;//Total distance driven by medium (M) buses i in year x (km)
    dd_l: number;// Total distance driven by large (L) buses i in year x (km)

    v: number; //Average speed of vehicles
    n: number; //Fuel efficiency of baseline vehicle i (qty of fuel/km)



}