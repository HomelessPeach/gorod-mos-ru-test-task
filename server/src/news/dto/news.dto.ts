import {IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class MosRuRequestDto {

    @IsArray()
    data_page?: NewsDto[];

    @IsNumber({},{each: true})
    ids?: number[];

    @IsNumber()
    count?: number;
}

export class NewsDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsString()
    title: string

    @IsString()
    text_preview: string

    @IsString()
    text: string

    @IsString()
    photo_preview: string

    @IsString()
    clearTextPreview: string

    @IsDate()
    period_month: Date

    @IsNumber()
    created_at: number

    @IsNumber()
    updated_at: number

    @IsNumber()
    date_publish: number

    @IsNumber()
    count_view: number

    @IsNumber()
    media_file_id: number

    @IsBoolean()
    is_volunteer: boolean

    @IsBoolean()
    published: boolean

    @IsString()
    video: string

    @IsArray()
    newsThemes: string[]
}