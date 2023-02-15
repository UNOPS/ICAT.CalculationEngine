import { Controller } from '@nestjs/common';
import { CdmAcm0017Service } from './cdm-acm0017.service';

@Controller('cdm-ams-iii-ak')
export class CdmAcm0017Controller {
  constructor(public service: CdmAcm0017Service) {}
}
