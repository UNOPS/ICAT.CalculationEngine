import { VehicleTypeEnum } from 'src/calculation/enum/vehicle-type.enum';
import { fuelDto } from './fuel.dto';

export class vehicleDto {
  fuel: fuelDto;
  name: string;
  type: VehicleTypeEnum;
  beftkmixy: number; //Baseline emission factor per tkm
  sfcblixy: number; //Specific baseline OR project fuel consumption
  awblixy: number; // Average GVW baseline OR project
  avgweightbyvehicle: number;
  totaldistancetravel: number;
  altkmixy: number;
}
