import {ConflictException, Injectable, StreamableFile} from '@nestjs/common';
import * as Excel from 'exceljs'
import {FileSystemStoredFile} from "nestjs-form-data";
import {DataForPPTXDto, GetExcelSheetsFilesDto} from "./dto/statistic.dto";
import {join} from "path";
import {createReadStream, promises as fs} from "fs";

const ChartJSImage = require('chart.js-image');
const PowerPoint = require('pptxgenjs');

@Injectable()
export class StatisticService {

    async getComparativeStatistic(formDataFiles: FileSystemStoredFile[]): Promise<StreamableFile> {
        const {firstSheet, secondSheet} = await this.getExcelSheetsFiles(formDataFiles)
        const data = await this.getData(firstSheet, secondSheet)
        return await this.createPPTX(data)
    }

    async getExcelSheetsFiles(files: FileSystemStoredFile[]): Promise<GetExcelSheetsFilesDto> {
        //@ts-ignore
        if (files.length !== 2 || files[0].fileType.ext !== 'xlsx' || files[1].fileType.ext !== 'xlsx') {
            throw new ConflictException('Необходимо загрузить 2 файла с расширением .xlsx')
        }
        //@ts-ignore
        const sheet1 = await this.getExcelSheet(files[0].buffer)
        //@ts-ignore
        const sheet2 = await this.getExcelSheet(files[1].buffer)
        const checkArray1 = ['Номер заявки', 'Округ', 'Регламентный срок подготовки ответа', 'Статус подготовки ответа']
        const checkArray2 = ['Номер заявки', 'Дата публикации ответа']
        const result: GetExcelSheetsFilesDto = {
            firstSheet: null,
            secondSheet: null
        }
        if (this.checkHeaders(sheet1.getRow(1), checkArray1) && this.checkHeaders(sheet2.getRow(1), checkArray2)) {
            result.firstSheet = sheet1
            result.secondSheet = sheet2
        } else if (this.checkHeaders(this.checkHeaders(sheet2.getRow(1), checkArray1) && sheet1.getRow(1), checkArray2)) {
            result.firstSheet = sheet2
            result.secondSheet = sheet1
        } else {
            throw new ConflictException(`Первая строка одного из файлов должна содержать поля: '${checkArray1.join("', '")}'. А первая строка другого '${checkArray2.join("', '")}`)
        }
        return result
    }

    async getData(firstSheet: Excel.Worksheet, secondSheet: Excel.Worksheet): Promise<DataForPPTXDto[]> {
        const result = []

        const firstSheetColumns = firstSheet.getRow(1).values as Excel.CellValue[]
        const secondSheetColumns = secondSheet.getRow(1).values as Excel.CellValue[]

        const firstSheetColumnIndex = {
            id: firstSheetColumns.indexOf('Номер заявки'),
            area: firstSheetColumns.indexOf('Округ'),
            regDate: firstSheetColumns.indexOf('Регламентный срок подготовки ответа'),
        }
        const secondSheetColumnIndex = {
            id: secondSheetColumns.indexOf('Номер заявки'),
            publishDate: secondSheetColumns.indexOf('Дата публикации ответа'),
        }

        for (let index = 2; index < firstSheet.getColumn(firstSheetColumnIndex.id).values.length; index++) {
            const firstSheetRow = firstSheet.getRow(index)

            if (!firstSheetRow.getCell(firstSheetColumnIndex.id).value ||
                !firstSheetRow.getCell(firstSheetColumnIndex.area).value ||
                !firstSheetRow.getCell(firstSheetColumnIndex.regDate).value
            ) {
                continue;
            }

            const secondSheetRowIndex = (secondSheet.getColumn(secondSheetColumnIndex.id).values as Excel.CellValue[]).indexOf(firstSheetRow.getCell(firstSheetColumnIndex.id).value)
            const secondSheetRow = (secondSheetRowIndex !== -1) ? secondSheet.getRow(index) : null

            let resultIndex = result.findIndex((item) => item.area === firstSheetRow.getCell(firstSheetColumnIndex.area).value)
            if (resultIndex === -1) {
                result.push({
                    area: firstSheetRow.getCell(firstSheetColumnIndex.area).value,
                    successfully: 0,
                    unsuccessfully: 0,
                })
                resultIndex = result.length - 1
            }

            if (
                (secondSheetRow && secondSheetRow.getCell(secondSheetColumnIndex.publishDate).value &&
                    new Date((firstSheetRow.getCell(firstSheetColumnIndex.regDate).value as string).split('.').reverse().join('-')) >=
                    new Date((secondSheetRow.getCell(secondSheetColumnIndex.publishDate).value as string).split('.').reverse().join('-')))
            ) {
                result[resultIndex].successfully++
            } else if (
                (secondSheetRow && secondSheetRow.getCell(secondSheetColumnIndex.publishDate).value &&
                    new Date((firstSheetRow.getCell(firstSheetColumnIndex.regDate).value as string).split('.').reverse().join('-')) <
                    new Date((secondSheetRow.getCell(secondSheetColumnIndex.publishDate).value as string).split('.').reverse().join('-'))) ||
                (!secondSheetRow && new Date((firstSheetRow.getCell(firstSheetColumnIndex.regDate).value as string).split('.').reverse().join('-')) < new Date())
            ) {
                result[resultIndex].unsuccessfully++
            }
        }

        return result.filter((item) => item.successfully + item.unsuccessfully >= 10);
    }

    async createPPTX(data: DataForPPTXDto[]): Promise<StreamableFile> {
        const pptx = new PowerPoint();
        const slide = pptx.addSlide();

        if (!data.length) {
            slide.addText(
                'Недостаточно данных для формирования графика. Для отображения округа должно быть не менее 10 заявок, данные которых полностью указаны в таблице без пропуска полей',
                { x:'10%', y:'5%', w:'80%', fontSize: 12, fontFace:'Arial', color: '#700000' }
            );
        }
        const chart = await ChartJSImage()
            .chart({
                type: 'bar',
                data: {
                    labels: data.map((item) => item.area),
                    datasets: [{
                        label: 'Регламентный срок не превышен',
                        data: data.map((item) => item.successfully)
                    }, {
                        label: 'Регламентный срок превышен',
                        data: data.map((item) => item.unsuccessfully)
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "Сравнительная статистика превышения регламентного срока в разрезе округов",
                        fontSize: 30
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            fontSize: 20
                        }
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                fontSize: 20
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                fontSize: 20
                            }
                        }],
                    }
                }
            })
            .backgroundColor('white')
            .width(1600)
            .height(900)
            .toDataURI()

        slide.addImage({data: chart, w: '80%', h: '80%', x: '10%', y: '10%'})

        const fileName = 'Сравнительная статистика превышения регламентного срока в разрезе округов.pptx'
        const dirPath = join(__dirname, '..', '..', '..','public', 'files')
        const filePath = join(dirPath, fileName)
        await fs.mkdir(dirPath, { recursive: true })
        await pptx.writeFile({fileName: filePath});
        const file = createReadStream(filePath);
        return new StreamableFile(file, {
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            disposition: `attachment; filename="${encodeURIComponent(fileName)}"`,
        });
    }

    async getExcelSheet(file: Buffer) {
        const workbook = new Excel.Workbook();
        await workbook.xlsx.load(file);
        return workbook.getWorksheet(1)
    }

    checkHeaders(row: Excel.Row, checkArray: string[]) {
        let index = 1
        while (row.getCell(index).value) {
            const findIndex = checkArray.indexOf(String(row.getCell(index).value))
            if (findIndex !== -1) {
                checkArray.splice(findIndex, 1)
            }
            index++
        }
        return checkArray.length === 0;
    }

}
