import { SampleService } from './sample.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Sample } from './entity/sample.entity';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('sample')
@UseGuards(LocalAuthGuard)

export class SampleController {
    constructor(public service: SampleService) {

    }

    @Get('hello/:name')
    async getHello(@Param('name') name: string): Promise<string> {
        return await this.service.hello(name);
    }

    @Post()
    create(@Body() createCatDto: Sample) {
        return this.service.hellosave(createCatDto);
    }

    @Get('')
    async findall() {
        return this.service.findAll();

    }

}
