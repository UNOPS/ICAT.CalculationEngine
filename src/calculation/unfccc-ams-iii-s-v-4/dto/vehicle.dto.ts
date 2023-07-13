import { VehicleTypeEnum } from "src/calculation/enum/vehicle-type.enum";
import { FuelDto } from "./fuel.dto";

export class VehicleDto {

    vehicleType: VehicleTypeEnum;
    vehiclety: VehicleTypeEnum;
    vehicleName: string;

    p: number; //Total annual passengers or tons of goods transported by each baseline vehicle i (passengers or tons) 
    fc: number;

    fc_mass: number;

    d: number; //Total annual distance travelled by each baseline vehicle i (km)

    dp: number;  // The annual average distance of transportation per person or tonne of freight by each baseline vehicle i (km)

    n: number; //Fuel efficiency of baseline vehicle i (qty of fuel/km)

    fuel: FuelDto;

    //----------------------------------------------
    //  use for jica-tcm-ms-p-v3
    //---------------------------------
    ef_pkm: number; // CO2 emission factor per passenger kilometer for transport mode i (t-CO2/passenger-km)

    ef_km: number;  // CO2 emission factor of transport mode i (t-CO2 /km)

    sfc: number; // Fuel consumption rate of transportation i

    ms: number;  // Share of passengers by transport mode

    or: number; // e occupancy rate

    // -------------------------------
    // use cdm_ams_iii_C
    //--------------------------------

    ir: number;


    // -------------------------------
    // use am0110
    //--------------------------------
    t: number;
    ef_bl: number;

    // -------------------------------
    // use am0031
    //--------------------------------
    y: number;
    // nix:number;
    ninx: number;
    sd: number;
    nisy: number;
    nzx: number; //Total number of buses Z in use in year x (units)

    dd_s: number;//Total distance driven by small (S) buses i in year x (km)
    dd_m: number;//Total distance driven by medium (M) buses i in year x (km)
    dd_l: number;// Total distance driven by large (L) buses i in year x (km)
    v: number; //Average speed of vehicles
    cv: number; //Average capacity of a vehicle in vehicle category
}