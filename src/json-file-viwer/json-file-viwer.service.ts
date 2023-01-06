import { Injectable } from '@nestjs/common';

@Injectable()
export class JsonFileViwerService {

    public selectJson(name: string): any {

        const fs = require('fs');
        let parsedJsonData: string = "json";

        


        try {
            const data = fs.readFileSync('./json-files/' + name + '.json', 'utf8')

            const jsonData = JSON.parse(data,)

            parsedJsonData = jsonData


            return parsedJsonData

        } catch (error) {
            return error
        }
    }
}
