import {Body, Controller, Post, UploadedFile} from '@nestjs/common';
import {FormDataRequest} from 'nestjs-form-data';
import {StatisticService} from './statistic.service';
import {ComparativeStatisticDto} from "./dto/statistic.dto";


@Controller('statistic')
export class StatisticController {
    constructor(private readonly statisticsService: StatisticService) {
    }

    @Post('comparative-statistic')
    @FormDataRequest()
    async getComparativeStatistic(@Body() body: ComparativeStatisticDto) {
        return await this.statisticsService.getComparativeStatistic(body.files);
    }

}
