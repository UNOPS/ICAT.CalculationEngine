import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ConsumerPriceEntity } from './entity/consumer-price.entity';

const readXlsxFile = require('read-excel-file/node');
@Injectable()
export class ConsumerPriceService extends TypeOrmCrudService<ConsumerPriceEntity>{

    constructor(
        @InjectRepository(ConsumerPriceEntity) repo,
    ) {
        super(repo);

    }
    async updateConsumervalue(countryCode: string, year: number): Promise<number> {
        let y = year;
        let price = await this.repo.findOne({ where:{ countryCode: countryCode, year: y} }).then((valu) => { if (valu) { return valu.value } });
            return price;
    }


    async getConsumervalue(countryCode: string, year: number): Promise<number> {
        let y = year;
        let price = await this.repo.findOne({ where:{ countryCode: countryCode, year: y} }).then((valu) => { if (valu) { return valu.value } });
        while (price == undefined) {
             price = await this.repo.findOne({ where:{countryCode: countryCode, year: y }}).then((valu) => { if (valu) { return valu.value } });
            y = y - 1;
        }
            return price;
    }

    async ConsumeruploadOneValue(req: ConsumerPriceEntity): Promise<string> {
        let price = await this.getConsumervalue(req.countryCode, req.year);
        if (price < 0) {
            await this.repo.save(req);
            return "success"
        }
        else return "allready exit this value"
    }


    async Consumerupload(name: string) {
        let columnCount = 0;
        let rowCunt = 0;

        var Excel = require('exceljs');

        var wb = new Excel.Workbook();
        var path = require('path');
        var filePath = path.resolve('./public/' + name);

        await wb.xlsx.readFile(filePath).then(function () {

            let sh = wb.getWorksheet("Data");

            columnCount = sh.columnCount
            rowCunt = sh.rowCount;
        });

        for (let i = 5; i < rowCunt; i++) {
            for (let j = 5; j < columnCount; j++) {
                let ppp = new ConsumerPriceEntity();
                await wb.xlsx.readFile(filePath).then(async () => {

                    let sh = wb.getWorksheet("Data");

                    ppp.countryName = "" + sh.getRow(i).getCell(1).value;
                    ppp.countryCode = "" + sh.getRow(i).getCell(2).value
                    ppp.year = parseInt(sh.getRow(4).getCell(j).value)
                    ppp.value = sh.getRow(i).getCell(j).value

                    if (ppp.value != null) {
                        let price = await this.updateConsumervalue(ppp.countryCode, ppp.year);
                        if (price < 0 || price==undefined || price==null) {
                            await this.repo.save(ppp);
                        }
                    }

                });

            }
        }
        return "Upload Success";
    }
}
