import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { PriceUpdate } from "./dto/priceUpdate.dto";
import { PppConversionFactor } from "./entity/ppp-conversion-factor.entity";

const readXlsxFile = require('read-excel-file/node');

@Injectable()
export class PPPPriceService extends TypeOrmCrudService<PppConversionFactor>{

    constructor(
        @InjectRepository(PppConversionFactor) repo,
    ) {
        super(repo);

    }

    async uploadPPPvalue(countryCode: string, year: number): Promise<number> {
        // console.log(countryCode)
        let years = year
        let price = await this.repo.findOne({ countryCode: countryCode, year: years }).then((valu) => { if (valu) { return valu.value } });
        // let price = ( await this.repo.findOne({ countryCode, year })).value;
        // console.log("+++++++++++", price)
        // while (price == undefined) {
        //     price = await this.repo.findOne({ countryCode: countryCode, year: years }).then((valu) => { if (valu) { return valu.value } });
        //     years = years - 1;
        // }
        return price;

    }

    async getPPPvalue(countryCode: string, year: number): Promise<number> {
        // console.log(countryCode)
        let years = year
        let price = await this.repo.findOne({ countryCode: countryCode, year: years }).then((valu) => { if (valu) { return valu.value } });
        
        while (price == undefined) {
            price = await this.repo.findOne({ countryCode: countryCode, year: years }).then((valu) => { if (valu) { return valu.value } });
            years = years - 1;
        }
        return price;

    }
    async ConsumeruploadOneValue(req: PriceUpdate): Promise<string> {
        let price = await this.getPPPvalue(req.countryCode, req.year);
        if (price < 0) {
            await this.repo.save(req);
            return "success"
        }
        else return "allready exit this value"
    }

    async PPPupload(name: string) {
        // let service = IcatTpm2020Service;
        const Excel = require('exceljs');
        var mainData = new Array();
        let columnCount = 0;
        let rowCunt = 0;

        var wb = new Excel.Workbook();
        var path = require('path');
        var filePath = path.resolve('./public/' + name);

        await wb.xlsx.readFile(filePath).then(function () {

            let sh = wb.getWorksheet("Data");

            // sh.getRow(1).getCell(2).value = 32;
            columnCount = sh.columnCount
            rowCunt = sh.rowCount;
            console.log(columnCount)
        });


        for (let i = 5; i < rowCunt; i++) {
            for (let j = 5; j < columnCount; j++) {
                let ppp = new PppConversionFactor();
                await wb.xlsx.readFile(filePath).then(async () => {

                    let sh = wb.getWorksheet("Data");

                    ppp.countryName = "" + sh.getRow(i).getCell(1).value;
                    ppp.countryCode = "" + sh.getRow(i).getCell(2).value
                    ppp.year = parseInt(sh.getRow(4).getCell(j).value)
                    ppp.value = sh.getRow(i).getCell(j).value


                    console.log(columnCount)
                    if (ppp.value != null) {
                        console.log(ppp)
                        let price = await this.uploadPPPvalue(ppp.countryCode, ppp.year);
                        // console.log( price)
                        if (price < 0|| price==undefined || price==null) {
                            await this.repo.save(ppp);
                        }
                        // console.log(price + "console.log(columnCount)")
                    }

                });

                mainData.push(ppp)
            }
        }
        return mainData;
    }


}