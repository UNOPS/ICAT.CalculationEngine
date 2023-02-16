import { LeakageDto } from 'src/calculation/cdm-am0031/dto/leakage.dto';
import { vehicleDto } from './vehicle.dto';

export class projecteDto {
  year: number;

  vehicle: vehicleDto[]; // bus and trucks and other

  gwpch4: number;

  leakege: LeakageDto;

  py: number;
}
