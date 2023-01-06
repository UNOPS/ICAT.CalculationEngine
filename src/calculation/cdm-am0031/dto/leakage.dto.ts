import { VehicleDto } from "src/calculation/unfccc-ams-iii-s-v-4/dto/vehicle.dto";

export class LeakageDto {
    
    bscr: number;//Cumulative bus units displaced by the BRT on the trunk lanes as a  result of the project in year y (units)
    src: number;// Share of road space used by public transport in year x (in percentage). Calculated based on equation (14) below
    rsx: number; //Total road space available in year x (lane- kilometers)
    rsy: number; //Total available road space due to the project in year y (lanekilometers)

    //src
    dd_zx: number; //Total distance driven by public transport buses in year x (km)
    dd_tx: number; //Total distance driven in kilometers by taxis in year x (km)
    dd_cx: number; //Total distance driven in by passenger cars in year x (km)
}