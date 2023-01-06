import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumerPriceService } from 'src/calculation/icat-tpm-2020/consumer-price.service.service';
import { ConsumerPriceEntity } from 'src/calculation/icat-tpm-2020/entity/consumer-price.entity';
import { PppConversionFactor } from 'src/calculation/icat-tpm-2020/entity/ppp-conversion-factor.entity';
import { IcatTpm2020Service } from 'src/calculation/icat-tpm-2020/icat-tpm-2020.service';
import { UnfcccAmsIiiBcService } from 'src/calculation/unfccc-ams-iii-bc/unfccc-ams-iii-bc.service';
import { JicaTcmMsPV3Service } from 'src/calculation/jica-tcm-ms-p-v-3/jica-tcm-ms-p-v-3.service';
import { ProjectionService } from 'src/calculation/projection/projection.service';
import { UnfcccAmsIiiC15Service } from 'src/calculation/unfccc-ams-iii-c-15/unfccc-ams-iii-c-15.service';
import { UnfcccAmsIIISV4Service } from 'src/calculation/unfccc-ams-iii-s-v-4/unfccc-ams-iii-s-v-4.service';
import { Methodology } from './enitity/methodology.entity';
import { MethodologyController } from './methodology.controller';
import { MethodologyService } from './methodology.service';
import { UnfcccAm0090V0110Service } from 'src/calculation/unfccc_am0090_v_01_1_0/unfccc_am0090_v_01_1_0.service';
import { UnfcccAm0016V5Service } from 'src/calculation/unfccc-am0016-v-5/unfccc-am0016-v-5.service';
import { PPPPriceService } from 'src/calculation/icat-tpm-2020/ppp-price-service.service';
import { JicaRailwayFreightService } from 'src/calculation/jica-railway-freight/jica-railway-freight.service';
import { JicaRailwayPassengerService } from 'src/calculation/jica-railway-passenger/jica-railway-passenger.service';
import { AM0110VE02Service } from 'src/calculation/am0110_ve02.0/am00110_ve02.service';
import { CdmAmsIiiAkService } from 'src/calculation/cdm-ams-iii-ak/cdm-ams-iii-ak.service';
import { CdmAcm0017Service } from 'src/calculation/cdm-acm0017/cdm-acm0017.service';
import { CdmAmsIIIATService } from 'src/calculation/cdm-ams-iii-at/cdm-ams-iii-at.service';
import { CdmAmsIiiBnService } from 'src/calculation/cdm-ams-iii-bn/cdm-ams-iii-bn.service';
import { CDMAM0031Service } from 'src/calculation/cdm-am0031/cdm-am0031.service';

@Module({
    imports: [TypeOrmModule.forFeature([PppConversionFactor, ConsumerPriceEntity, Methodology])],
    controllers: [MethodologyController],
    providers: [
        MethodologyService,
        UnfcccAmsIIISV4Service,
        IcatTpm2020Service,
        ConsumerPriceService,
        UnfcccAmsIiiBcService,
        ProjectionService,
        JicaTcmMsPV3Service,
        UnfcccAmsIiiC15Service,
        UnfcccAm0090V0110Service,
        UnfcccAm0016V5Service,
        PPPPriceService,
        JicaRailwayFreightService,
        JicaRailwayPassengerService,
        AM0110VE02Service,
        CdmAmsIiiAkService,
        CdmAcm0017Service,
        CdmAmsIIIATService,
        CdmAmsIiiBnService,
        CDMAM0031Service
    ],
    exports: [
        MethodologyService,
        UnfcccAmsIIISV4Service,
        IcatTpm2020Service,
        ConsumerPriceService,
        UnfcccAmsIiiBcService,
        ProjectionService,
        JicaTcmMsPV3Service,
        UnfcccAmsIiiC15Service,
        UnfcccAm0090V0110Service,
        UnfcccAm0016V5Service,
        PPPPriceService,
        JicaRailwayFreightService,
        JicaRailwayPassengerService,
        AM0110VE02Service,
        CdmAmsIiiAkService,
        CdmAcm0017Service,
        CdmAmsIIIATService,
        CdmAmsIiiBnService,
        CDMAM0031Service
    ],
}
)
export class MethodologyModule { }
