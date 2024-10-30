import {Module} from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {NewsService} from './news.service';
import {NewsController} from './news.controller';


@Module({
    imports: [
        HttpModule
    ],
    exports: [],
    controllers: [
        NewsController
    ],
    providers: [
        NewsService
    ],
})
export class NewsModule {
}
