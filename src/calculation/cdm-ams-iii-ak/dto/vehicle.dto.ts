export class VehicleDto {
  type: string;
  /** baselineDto */
  efco2: number; //CO2 emission factor (projectDto)

  /** projectDto */
  df: number; //Return trip distance between the origin and destination of freight transportation activity f
  fr: number; // Total mass of freight transported in freight transportation activity f
}
