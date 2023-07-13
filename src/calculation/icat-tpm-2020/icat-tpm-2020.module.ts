import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Methodology } from 'src/methodology/enitity/methodology.entity';
import { MethodologyService } from 'src/methodology/methodology.service';
import { ConsumerPriceService } from './consumer-price.service.service';
import { ConsumerPriceEntity } from './entity/consumer-price.entity';
import { PppConversionFactor } from './entity/ppp-conversion-factor.entity';
import { IcatTpm2020Controller } from './icat-tpm-2020.controller';
import { IcatTpm2020Service } from './icat-tpm-2020.service';
import { PPPPriceService } from './ppp-price-service.service';

@Module({
    imports:[TypeOrmModule.forFeature([PppConversionFactor,ConsumerPriceEntity,Methodology])],
    controllers:[IcatTpm2020Controller],
    providers:[IcatTpm2020Service,ConsumerPriceService,MethodologyService,PPPPriceService],
    exports:[IcatTpm2020Service,ConsumerPriceService,MethodologyService,PPPPriceService]
})
export class IcatTpm2020Module {}
