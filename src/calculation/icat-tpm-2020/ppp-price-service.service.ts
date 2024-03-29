import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PriceUpdate } from './dto/priceUpdate.dto';
import { PppConversionFactor } from './entity/ppp-conversion-factor.entity';

@Injectable()
export class PPPPriceService extends TypeOrmCrudService<PppConversionFactor> {
  constructor(@InjectRepository(PppConversionFactor) repo) {
    super(repo);
  }

  async uploadPPPvalue(countryCode: string, year: number): Promise<number> {
    const years = year;
    const price = await this.repo
      .findOne({ where: { countryCode: countryCode, year: years } })
      .then((valu) => {
        if (valu) {
          return valu.value;
        }
      });
    return price;
  }

  async getPPPvalue(countryCode: string, year: number): Promise<number> {
    let years = year;
    let price = await this.repo
      .findOne({ where: { countryCode: countryCode, year: years } })
      .then((valu: any) => {
        if (valu) {
          return valu.value;
        }
      });

    while (price == undefined) {
      price = await this.repo
        .findOne({ where: { countryCode: countryCode, year: years } })
        .then((valu: any) => {
          if (valu) {
            return valu.value;
          }
        });
      years = years - 1;
    }
    return price;
  }
  async ConsumeruploadOneValue(req: PriceUpdate): Promise<string> {
    const price = await this.getPPPvalue(req.countryCode, req.year);
    if (price < 0) {
      await this.repo.save(req);
      return 'success';
    } else return 'allready exit this value';
  }

  async PPPupload(name: string) {
    const Excel = require('exceljs');
    const mainData = [];
    let columnCount = 0;
    let rowCunt = 0;

    const wb = new Excel.Workbook();
    const path = require('path');
    const filePath = path.resolve('./public/' + name);

    await wb.xlsx.readFile(filePath).then(function () {
      const sh = wb.getWorksheet('Data');
      columnCount = sh.columnCount;
      rowCunt = sh.rowCount;
    });

    for (let i = 5; i < rowCunt; i++) {
      for (let j = 5; j < columnCount; j++) {
        const ppp = new PppConversionFactor();
        await wb.xlsx.readFile(filePath).then(async () => {
          const sh = wb.getWorksheet('Data');

          ppp.countryName = '' + sh.getRow(i).getCell(1).value;
          ppp.countryCode = '' + sh.getRow(i).getCell(2).value;
          ppp.year = parseInt(sh.getRow(4).getCell(j).value);
          ppp.value = sh.getRow(i).getCell(j).value;

          if (ppp.value != null) {
            const price = await this.uploadPPPvalue(ppp.countryCode, ppp.year);
            if (price < 0 || price == undefined || price == null) {
              await this.repo.save(ppp);
            }
          }
        });

        mainData.push(ppp);
      }
    }
    return mainData;
  }
}
