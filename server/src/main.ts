import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {application} from "../config";
import {ValidationPipe} from "@nestjs/common";

async function app() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
            origin: (origin, callback) => {
                if (application.cors.whiteList.indexOf(origin) !== -1 || origin === undefined) {
                    callback(null, true)
                } else {
                    callback(new Error('Not allowed by CORS'))
                }
            },
            credentials: true,
        });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true
        })
    );
    app.setGlobalPrefix('api');
    await app.listen(application.port);
}

app();
