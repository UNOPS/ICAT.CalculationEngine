
import { PriceElasticityDto } from "./priceElasticity.dto";

export class SpecialValueDto{
    
    year:number;
    countryCode:string;

    beta:number;
    toilIncrease:number;
    existingToil:number;  

    priceElasticity: PriceElasticityDto;
}