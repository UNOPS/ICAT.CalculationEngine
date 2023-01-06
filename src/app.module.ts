import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleModule } from './sample/sample.module';
import { Sample } from './sample/entity/sample.entity';
import { JicaTcmMsPV3Controller } from './calculation/jica-tcm-ms-p-v-3/jica-tcm-ms-p-v-3.controller';
import { JicaTcmMsPV3Service } from './calculation/jica-tcm-ms-p-v-3/jica-tcm-ms-p-v-3.service';
import { JicaTcmMsPV3Module } from './calculation/jica-tcm-ms-p-v-3/jica-tcm-ms-p-v-3.module';
import { IcatTpm2020Controller } from './calculation/icat-tpm-2020/icat-tpm-2020.controller';
import { IcatTpm2020Service } from './calculation/icat-tpm-2020/icat-tpm-2020.service';
import { IcatTpm2020Module } from './calculation/icat-tpm-2020/icat-tpm-2020.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectionService } from './calculation/projection/projection.service';
import { ProjectionController } from './calculation/projection/projection.controller';
import { ProjectionModule } from './calculation/projection/projection.module';
import { UnfcccAm0090V0110Module } from './calculation/unfccc_am0090_v_01_1_0/unfccc_am0090_v_01_1_0.module';
import { UnfcccAmsIiiBcModule } from './calculation/unfccc-ams-iii-bc/unfccc-ams-iii-bc.module';
import { UnfcccAm0090V0110Controller } from './calculation/unfccc_am0090_v_01_1_0/unfccc_am0090_v_01_1_0.controller';
import { UnfcccAm0090V0110Service } from './calculation/unfccc_am0090_v_01_1_0/unfccc_am0090_v_01_1_0.service';
import { PppConversionFactor } from './calculation/icat-tpm-2020/entity/ppp-conversion-factor.entity';
import { ConsumerPriceEntity } from './calculation/icat-tpm-2020/entity/consumer-price.entity';
//import { UnfcccAm0016V5Module } from './unfccc-am0016-v-5/unfccc-am0016-v-5.module';
import { UnfcccAm0016V5Module } from './calculation/unfccc-am0016-v-5/unfccc-am0016-v-5.module';
import { UnfcccAm0016V5Controller } from './calculation/unfccc-am0016-v-5/unfccc-am0016-v-5.controller';
import { UnfcccAm0016V5Service } from './calculation/unfccc-am0016-v-5/unfccc-am0016-v-5.service';
import { UnfcccAmsIIISV4Module } from './calculation/unfccc-ams-iii-s-v-4/unfccc-ams-iii-s-v-4.module';
import { UnfcccAmsIIISV4Service } from './calculation/unfccc-ams-iii-s-v-4/unfccc-ams-iii-s-v-4.service';
import { UnfcccAmsIIISV4Controller } from './calculation/unfccc-ams-iii-s-v-4/unfccc-ams-iii-s-v-4.controller';
import { UnfcccAmsIiiC15Controller } from './calculation/unfccc-ams-iii-c-15/unfccc-ams-iii-c-15.controller';
import { UnfcccAmsIiiC15Service } from './calculation/unfccc-ams-iii-c-15/unfccc-ams-iii-c-15.service';
import { UnfcccAmsIiiC15Module } from './calculation/unfccc-ams-iii-c-15/unfccc-ams-iii-c-15.module';
import { MethodologyController } from './methodology/methodology.controller';
import { MethodologyService } from './methodology/methodology.service';
import { MethodologyModule } from './methodology/methodology.module';
import { MacModule } from './calculation/mac/mac.module';
import { MacController } from './calculation/mac/mac.controller';
import { MacService } from './calculation/mac/mac.service';
import { UnitConversionModule } from './unit-conversion/unit-conversion.module';
import { UnitConversion } from './unit-conversion/enitity/unit-conversion.entity';
import { UnitConversionService } from './unit-conversion/unit-conversion.service';
import { UnitConversionController } from './unit-conversion/unit-conversion.controller';
import { JsonFileViwerService } from './json-file-viwer/json-file-viwer.service';
import { JsonFileViwerController } from './json-file-viwer/json-file-viwer.controller';
import { JsonFileViwerModule } from './json-file-viwer/json-file-viwer.module';
import { Methodology } from './methodology/enitity/methodology.entity';
import { ApplicabilityEntity } from './master-data/applicability/entity/applicability.entity';
import { ApplicabilityModule } from './master-data/applicability/applicability.module';
import { ApplicabilityService } from './master-data/applicability/applicability.service';
import { ApplicabilityController } from './master-data/applicability/applicability.controller';
import { MitigationActionType } from './master-data/mitigation-action/entity/mitigation-action.entity';
import { MitigationActionController } from './master-data/mitigation-action/mitigation-action.controller';
import { MitigationActionService } from './master-data/mitigation-action/mitigation-action.service';
import { MitigationActionModule } from './master-data/mitigation-action/mitigation-action.module';
import { Sector } from './master-data/sector/entity/sector.entity';
import { SectorController } from './master-data/sector/sector.controller';
import { SectorModule } from './master-data/sector/sector.module';
import { SectorService } from './master-data/sector/sector.service';
import { CountryModule } from './master-data/country/country.module';
import { CountryService } from './master-data/country/country.service';
import { CountryController } from './master-data/country/country.controller';
import { Country } from './master-data/country/entity/country.entity';
import { DefaultValueModule } from './master-data/default-value/default-value.module';
import { DefaultValue } from './master-data/default-value/defaultValue.entity';
import { DefaultValueController } from './master-data/default-value/default-value.controller';
import { DefaultValueService } from './master-data/default-value/default-value.service';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { am0110VE02Module } from './calculation/am0110_ve02.0/am0110_ve02.moduel';
import { JicaRailwayFreight } from './calculation/jica-railway-freight/jica-railway-freight.module';
import { JicaRailwayPassenger } from './calculation/jica-railway-passenger/jica-railway-passenger.module';
import { JicaRailwayPassengerService } from './calculation/jica-railway-passenger/jica-railway-passenger.service';
import { JicaRailwayFreightService } from './calculation/jica-railway-freight/jica-railway-freight.service';
import { MethodologyData } from './master-data/methodology-data/methodology-data.entity';
import { MethodologyDataModule } from './master-data/methodology-data/methodology-data.module';
import { MethodologyDataController } from './master-data/methodology-data/methodology-data.controller';
import { MethodologyDataService } from './master-data/methodology-data/methodology-data.service';
import { CdmAm0031AkModule } from './calculation/cdm-am0031/cdm-am0031.module';
import { CDMAM0031Service } from './calculation/cdm-am0031/cdm-am0031.service';
@Module({
  imports: [SampleModule,
    TypeOrmModule.forFeature([
      Sample,
      PppConversionFactor,
      ConsumerPriceEntity,
      UnitConversion,
      Methodology,
      ApplicabilityEntity,
      MitigationActionType,
      Sector,
      Country,
      DefaultValue,
      MethodologyData,
    ]),

    MulterModule.register({
      dest: './public',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      // password: 'icat',
      // database: 'calculation_engine',
      password: 'pasindu',
      database: 'calculation',
      entities: [
        PppConversionFactor,
        Sample,
        ConsumerPriceEntity,
        UnitConversion,
        Methodology,
        ApplicabilityEntity,
        MitigationActionType,
        Sector,
        Country,
        DefaultValue,
        MethodologyData,
      ],
      // autoLoadEntities:true,

      synchronize: false,
    }),
    JsonFileViwerModule,
    MacModule,
    UnfcccAmsIiiC15Module,
    MethodologyModule,
    UnfcccAmsIIISV4Module,
    JicaTcmMsPV3Module,
    IcatTpm2020Module,
    UnfcccAm0090V0110Module,
    UnfcccAmsIiiBcModule,
    UnfcccAm0016V5Module,
    ProjectionModule,
    ApplicabilityModule,
    MitigationActionModule,
    SectorModule,
    CountryModule,
    DefaultValueModule,
    UnitConversionModule,
    am0110VE02Module,
    JicaRailwayFreight,
    JicaRailwayPassenger,
    MethodologyDataModule,
    CdmAm0031AkModule,
  ],

  controllers: [
    AppController,
    JicaTcmMsPV3Controller,
    IcatTpm2020Controller,
    ProjectionController,
    UnfcccAm0090V0110Controller,
    UnfcccAm0016V5Controller,
    JsonFileViwerController,
    UnitConversionController,
    MethodologyController,
    UnfcccAmsIiiC15Controller,
    UnfcccAmsIIISV4Controller,
    ProjectionController,
    MacController,
    ApplicabilityController,
    MitigationActionController,
    SectorController,
    CountryController,
    DefaultValueController,
    MethodologyDataController,
  ],
  providers: [
    AppService,
    JicaTcmMsPV3Service,
    IcatTpm2020Service,
    ProjectionService,
    UnfcccAm0090V0110Service,
    UnfcccAm0016V5Service,
    MacService,
    UnfcccAmsIIISV4Service,
    UnfcccAmsIiiC15Service,
    MethodologyService,
    UnitConversionService,
    JsonFileViwerService,
    ApplicabilityService,
    MitigationActionService,
    SectorService,
    CountryService,
    DefaultValueService,
    JicaRailwayPassengerService,
    JicaRailwayFreightService,
    MethodologyDataService,
    CDMAM0031Service,
  ],
})
export class AppModule { }
