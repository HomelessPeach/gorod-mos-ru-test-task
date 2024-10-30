import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {NewsModule} from './news/news.module';
import {StatisticModule} from './statistic/statistic.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";


@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'public', 'app'),
        }),
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        NewsModule,
        StatisticModule
    ],
    exports: [],
    controllers: [],
    providers: [],
})
export class AppModule {
}
