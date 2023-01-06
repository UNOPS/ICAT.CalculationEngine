import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JsonFileViwerService } from './json-file-viwer.service';

@Controller('filename')
@UseGuards(LocalAuthGuard)
export class JsonFileViwerController {

    constructor(public service: JsonFileViwerService,
        
    ) {
    }

    @Get(':name')
    public methodology(@Param('name') name) {
        return this.service.selectJson(name);
    }
}
