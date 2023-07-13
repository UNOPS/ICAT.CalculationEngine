import { FeedstockDto } from "./feedstock.dto";
import { VehicleDto } from "./vehicle.dto";

export class ProjectDto{
    year: number;
    feedstock: FeedstockDto[];
}