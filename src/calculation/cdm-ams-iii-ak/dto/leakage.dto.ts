import { FuelDto } from './fuel.dto';
import { residueDto } from './residue.dto';

export class LeakageDto {
  year: number;
  fuel: FuelDto[];
  residue: residueDto[];
  efco2: number;
  ncvbf: number;
}
