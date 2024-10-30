import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {FileSystemStoredFile, IsFiles} from "nestjs-form-data";
import * as Excel from "exceljs";

export class ComparativeStatisticDto {

    @IsFiles()
    @IsNotEmpty()
    files: FileSystemStoredFile[];

}

export class GetExcelSheetsFilesDto {

    firstSheet: Excel.Worksheet | null

    secondSheet: Excel.Worksheet | null

}

export class DataForPPTXDto {

    @IsNotEmpty()
    @IsString()
    area: string

    @IsNotEmpty()
    @IsNumber()
    successfully: number

    @IsNotEmpty()
    @IsNumber()
    unsuccessfully: number

}