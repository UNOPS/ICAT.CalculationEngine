import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { ProjectTypeEnum } from '../enum/project_type.enum';
import { PppConversionFactor } from './entity/ppp-conversion-factor.entity';
import { IcatTpm2020Service } from './icat-tpm-2020.service';
import { IcatTpm2020request } from './message/calculation-request-msg';
import { icatCATResponceMsg } from './message/calculation-response-msg';
import { diskStorage } from 'multer';
import { ConsumerPriceService } from './consumer-price.service.service';
import { PPPPriceService } from './ppp-price-service.service';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { editFileName, excelFileFilter } from 'src/utils/file-upload.utils';
import { ConsumerPriceEntity } from './entity/consumer-price.entity';
import { PriceUpdate } from './dto/priceUpdate.dto';

@Crud({
  model: {
    type: PppConversionFactor,
  },
})
@Controller('icat-tpm-2020')
export class IcatTpm2020Controller {
  constructor(
    public service: IcatTpm2020Service,
    public consumeService: ConsumerPriceService,
    public pppService: PPPPriceService,
  ) {}

  @Post('/consumer-file-update')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: excelFileFilter,
    }),
  )
  public async ConsumerPricUpdate(@UploadedFile() file) {
    const newSavedfile = file.filename;

    return this.consumeService.Consumerupload(newSavedfile);
  }

  @Post('/consumer-price-update')
  public async ConsumerPricUpdateOneValue(
    @Body() req: ConsumerPriceEntity,
  ): Promise<string> {
    return this.consumeService.ConsumeruploadOneValue(req);
  }

  @Post('/ppp-price-update')
  public async pppPricUpdateOneValue(
    @Body() req: PriceUpdate,
  ): Promise<string> {
    return await this.pppService.ConsumeruploadOneValue(req);
  }

  @Post('/ppp-file-update')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: excelFileFilter,
    }),
  )
  public async PPPPriceUpdate(@UploadedFile() file) {
    const newSavedfile = file.filename;

    return this.pppService.PPPupload(newSavedfile);
  }

  @Post('/icat-tpm-2020')
  public async ICAT_TPM_2020(
    @Body() req: IcatTpm2020request,
  ): Promise<icatCATResponceMsg> {
    const response = new icatCATResponceMsg();
    let baseLineEmission = 0;
    let ghgImpact = 0;

    // get baseline emission value

    if (req.projectType.baseLineApproch > 0) {
      if (
        req.projectType.baseLineApproch === ProjectTypeEnum.baseLineApproch_A
      ) {
        for (const num in req.baseline.vehicle) {
          let emission = 0;
          if (req.baseline.fuelUsed > 0) {
            emission = this.service.baseLineEmission(
              req.baseline.fuelUsed,
              req.baseline.vehicle[num].fuel.fuelShare,
              req.baseline.vehicle[num].fuel.ef,
            );
          }

          baseLineEmission += emission;
        }
        response.baseLineEmission = baseLineEmission;
      } else if (
        req.projectType.baseLineApproch === ProjectTypeEnum.baseLineApproch_B
      ) {
        for (const num in req.baseline.vehicle) {
          const emission = this.service.baseLineEmissoioB(
            req.baseline.vehicle[num].fuel.used_weight,
            req.baseline.vehicle[num].fuel.used_liters,
            req.baseline.vehicle[num].fuel.density,
            req.baseline.vehicle[num].fuel.ncv,
            req.baseline.vehicle[num].fuel.ef,
          );

          baseLineEmission += emission;
        }
        response.baseLineEmission = baseLineEmission;
      } else if (
        req.projectType.baseLineApproch === ProjectTypeEnum.baseLineApproch_C
      ) {
        let fuelEmission = 0;
        let elecEmission = 0;
        for (const num in req.baseline.vehicle) {
          if (
            (req.baseline.vehicle[num].fuel.vkt > 0 ||
              req.baseline.vehicle[num].fuel.fc === 0) &&
            req.baseline.vehicle[num].fuel.type === ''
          ) {
            const fuelEnergy = this.service.fuelEnergyWithVKT(
              req.baseline.vehicle[num].fuel.vkt,
              req.baseline.vehicle[num].fuel.sfc,
              req.baseline.vehicle[num].fuel.density,
              req.baseline.vehicle[num].fuel.ncv,
              req.baseline.vehicle[num].fuel.ef,
            );
            fuelEmission += fuelEnergy;
          } else if (
            req.baseline.vehicle[num].fuel.vkt === 0 ||
            req.baseline.vehicle[num].fuel.fc > 0
          ) {
            const fuelEnergy = this.service.fuelEnergyWithFC(
              req.baseline.vehicle[num].fuel.fc,
              req.baseline.vehicle[num].fuel.density,
              req.baseline.vehicle[num].fuel.ncv,
              req.baseline.vehicle[num].fuel.ef,
            );
            fuelEmission += fuelEnergy;
          } else if (req.baseline.vehicle[num].electricity.vkt > 0) {
            const elecEnergy = this.service.elecEnergy(
              req.baseline.vehicle[num].electricity.vkt,
              req.baseline.vehicle[num].electricity.sfc,
            );

            elecEmission = this.service.emission(
              req.baseline.vehicle[num].electricity.ef,
              elecEnergy,
            );
          } else if (req.baseline.vehicle[num].electricity.vkt === 0) {
            elecEmission = this.service.eleEmission(
              req.baseline.vehicle[num].electricity.ef,
              req.baseline.vehicle[num].electricity.fc,
            );
          }
        }

        baseLineEmission = fuelEmission + elecEmission;
      }
    }

    if (req.projectType.projectApproch > 0) {
      if (req.projectType.projectApproch === ProjectTypeEnum.projectApproch_A) {
        let fuelElasticity = 0;
        if (req.project.fuelMixPriceElasticity > 0) {
          fuelElasticity = req.project.fuelMixPriceElasticity;
        } else {
          const countriFuelPrice = await this.pppService.getPPPvalue(
            req.project.special.countryCode,
            req.project.special.year,
          );

          fuelElasticity = await this.service.elesticPrice(
            req.project.special.priceElasticity.mixFuelPrice,
            req.project.special.priceElasticity.capitalIncome,
            countriFuelPrice,
            req.project.special.year,
          );
        }

        const ghgEmission = this.service.AnticipatedCalculation(
          fuelElasticity,
          req.project.fuelMixPriceIncrease,
          baseLineEmission,
        );

        ghgImpact = ghgEmission - baseLineEmission;
      } else if (
        req.projectType.projectApproch === ProjectTypeEnum.projectApproch_B
      ) {
        for (const num in req.baseline.vehicle) {
          let fuelElasticity = 0;
          if (req.project.fuel[num].priceElasticity > 0) {
            fuelElasticity = req.project.fuel[num].priceElasticity;
          } else if (req.baseline.vehicle[num].fuel.type != 'diesel') {
            const countriFuelPrice = await this.pppService.getPPPvalue(
              req.project.special.countryCode,
              req.project.special.year,
            );

            fuelElasticity = await this.service.elesticPrice(
              req.project.fuel[num].fuelPrice,
              req.project.special.priceElasticity.capitalIncome,
              countriFuelPrice,
              req.project.special.year,
            );
          } else {
            const countriFuelPrice = await this.pppService.getPPPvalue(
              req.project.special.countryCode,
              req.project.special.year,
            );
            fuelElasticity = await this.service.elesticPriceWithdiesel(
              req.project.fuel[num].fuelPrice,
              req.project.special.priceElasticity.capitalIncome,
              countriFuelPrice,
              req.project.special.year,
            );
          }

          const emission = this.service.baseLineEmissoioB(
            req.baseline.vehicle[num].fuel.used_weight,
            req.baseline.vehicle[num].fuel.used_liters,
            req.baseline.vehicle[num].fuel.density,
            req.baseline.vehicle[num].fuel.ncv,
            req.baseline.vehicle[num].fuel.ef,
          );
          const ghgEmission = this.service.AnticipatedCalculation(
            fuelElasticity,
            req.project.fuel[num].priceIncrease,
            emission,
          );
          ghgImpact += ghgEmission;
        }
      } else if (
        req.projectType.projectApproch === ProjectTypeEnum.projectApproch_C
      ) {
        for (const num in req.baseline.vehicle) {
          let crosePriseElasticity = 0;
          if (req.project.fuel[num].priceElasticity > 0) {
            crosePriseElasticity = req.project.fuel[num].priceElasticity;
          } else {
            const countriFuelPrice = await this.pppService.getPPPvalue(
              req.project.special.countryCode,
              req.project.special.year,
            );
            crosePriseElasticity =
              await this.service.crossElesticPriceWithdiesel(
                req.project.special.priceElasticity.mixFuelPrice,
                req.project.special.priceElasticity.capitalIncome,
                countriFuelPrice,
                req.project.special.year,
                req.baseline.vehicle[num].vehicleType,
              );
          }

          const pasengerTransport = this.service.pkmCalculation(
            req.baseline.vehicle[num].or,
            req.baseline.vehicle[num].fuel.vkt,
          );

          const anticipatedPKM = this.service.AnticipatedCalculation(
            crosePriseElasticity,
            req.baseline.vehicle[num].fuel.priceIncrease,
            pasengerTransport,
          );

          const projetEmission = this.service.projectEmission(
            baseLineEmission,
            anticipatedPKM,
            pasengerTransport,
          );

          ghgImpact += projetEmission;
        }
      } else if (
        req.projectType.projectApproch === ProjectTypeEnum.roadpricingSimlified
      ) {
        let fuelEmission = 0;
        let fuelElasticity = 0;
        if (req.project.fuelMixPriceElasticity > 0) {
          fuelElasticity = req.project.fuelMixPriceElasticity;
        } else {
          const countriFuelPrice = await this.pppService.getPPPvalue(
            req.project.special.countryCode,
            req.project.special.year,
          );

          fuelElasticity = await this.service.elesticPrice(
            req.project.special.priceElasticity.mixFuelPrice,
            req.project.special.priceElasticity.capitalIncome,
            countriFuelPrice,
            req.project.special.year,
          );
        }

        for (const num in req.baseline.vehicle) {
          const vkt = this.service.changeVehicleTravel(
            req.baseline.vehicle[num].fuel.vkt,
            fuelElasticity,
            req.project.special.priceElasticity.mixFuelPrice,
            req.baseline.vehicle[num].fuelEconomy,
            req.project.special.toilIncrease,
            req.project.special.existingToil,
          );
          const fuelEnergy = this.service.fuelEnergyWithVKT(
            vkt,
            req.baseline.vehicle[num].fuel.sfc,
            req.baseline.vehicle[num].fuel.density,
            req.baseline.vehicle[num].fuel.ncv,
            req.baseline.vehicle[num].fuel.ef,
          );
          fuelEmission += fuelEnergy;
        }
        ghgImpact = fuelEmission;
      } else if (
        req.projectType.projectApproch === ProjectTypeEnum.cordonPricing
      ) {
        let fuelEmission = 0;

        for (const num in req.baseline.vehicle) {
          const vkt = this.service.reduction(
            req.baseline.vehicle[num].fuel.vkt,
            req.baseline.vehicle[num].percentageReduction,
          );
          const fuelEnergy = this.service.fuelEnergyWithVKT(
            vkt,
            req.baseline.vehicle[num].fuel.sfc,
            req.baseline.vehicle[num].fuel.density,
            req.baseline.vehicle[num].fuel.ncv,
            req.baseline.vehicle[num].fuel.ef,
          );
          fuelEmission += fuelEnergy;
        }
        ghgImpact = fuelEmission;
      }
    }

    response.baseLineEmission = parseFloat(Number(baseLineEmission).toFixed(2));
    response.projectEmission = parseFloat(Number(ghgImpact).toFixed(2));
    response.emissionReduction = parseFloat(
      Number(baseLineEmission - ghgImpact).toFixed(2),
    );

    return response;
  }
}
