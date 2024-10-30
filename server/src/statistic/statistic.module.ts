import {Module} from '@nestjs/common';
import {StatisticService} from './statistic.service';
import {StatisticController} from './statistic.controller';
import {MemoryStoredFile, NestjsFormDataModule} from "nestjs-form-data";


@Module({
    imports: [
        NestjsFormDataModule.config({ storage: MemoryStoredFile })
    ],
    exports: [],
    controllers: [
        StatisticController
    ],
    providers: [
        StatisticService
    ],
})
export class StatisticModule {
}
