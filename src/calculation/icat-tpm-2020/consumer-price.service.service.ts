import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ConsumerPriceEntity } from './entity/consumer-price.entity';

@Injectable()
export class ConsumerPriceService extends TypeOrmCrudService<ConsumerPriceEntity> {
  constructor(@InjectRepository(ConsumerPriceEntity) repo) {
    super(repo);
  }
  async updateConsumervalue(
    countryCode: string,
    year: number,
  ): Promise<number> {
    // console.log(countryCode)
    const y = year;
    const price = await this.repo
      .findOne({ where: { countryCode: countryCode, year: y } })
      .then((valu) => {
        if (valu) {
          return valu.value;
        }
      });
    // let price = ( await this.repo.findOne({ countryCode, year })).value;
    // while (price == undefined) {
    //     let price = await this.repo.findOne({ countryCode: countryCode, year: y }).then((valu) => { if (valu) { return valu.value } });
    //     y = y - 1;
    // }
    // if (price > 0) {
    return price;
    // }
    // else return -1;
  }

  async getConsumervalue(countryCode: string, year: number): Promise<number> {
    // console.log(countryCode)
    let y = year;
    let price = await this.repo
      .findOne({ where: { countryCode: countryCode, year: y } })
      .then((valu) => {
        if (valu) {
          return valu.value;
        }
      });
    // let price = ( await this.repo.findOne({ countryCode, year })).value;
    while (price == undefined) {
      price = await this.repo
        .findOne({ where: { countryCode: countryCode, year: y } })
        .then((valu) => {
          if (valu) {
            return valu.value;
          }
        });
      y = y - 1;
    }
    console.log('price+++++++', price);
    return price;
    // }
    // else return -1;
  }

  async ConsumeruploadOneValue(req: ConsumerPriceEntity): Promise<string> {
    const price = await this.getConsumervalue(req.countryCode, req.year);
    if (price < 0) {
      await this.repo.save(req);
      return 'success';
    } else return 'allready exit this value';
  }

  async Consumerupload(name: string) {
    let columnCount = 0;
    let rowCunt = 0;

    const Excel = require('exceljs');

    const wb = new Excel.Workbook();
    const path = require('path');
    const filePath = path.resolve('./public/' + name);

    await wb.xlsx.readFile(filePath).then(function () {
      const sh = wb.getWorksheet('Data');

      // sh.getRow(1).getCell(2).value = 32;
      columnCount = sh.columnCount;
      rowCunt = sh.rowCount;
      console.log(columnCount);
    });

    console.log(columnCount);

    for (let i = 5; i < rowCunt; i++) {
      for (let j = 5; j < columnCount; j++) {
        const ppp = new ConsumerPriceEntity();
        await wb.xlsx.readFile(filePath).then(async () => {
          const sh = wb.getWorksheet('Data');

          ppp.countryName = '' + sh.getRow(i).getCell(1).value;
          ppp.countryCode = '' + sh.getRow(i).getCell(2).value;
          ppp.year = parseInt(sh.getRow(4).getCell(j).value);
          ppp.value = sh.getRow(i).getCell(j).value;

          console.log(columnCount);
          if (ppp.value != null) {
            console.log(ppp);
            const price = await this.updateConsumervalue(
              ppp.countryCode,
              ppp.year,
            );
            console.log(price);
            if (price < 0 || price == undefined || price == null) {
              await this.repo.save(ppp);
            }
            // console.log(price + "console.log(columnCount)")
          }
        });
      }
    }
    return 'Upload Success';
  }
}
