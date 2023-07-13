import { Module } from '@nestjs/common';
import { UnfcccAmsIiiC15Controller } from './unfccc-ams-iii-c-15.controller';
import { UnfcccAmsIiiC15Service } from './unfccc-ams-iii-c-15.service';

@Module({
    controllers: [UnfcccAmsIiiC15Controller],
    providers: [UnfcccAmsIiiC15Service],
    exports: [UnfcccAmsIiiC15Service]
})
export class UnfcccAmsIiiC15Module { }
