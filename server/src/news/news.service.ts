import {HttpException, Injectable, StreamableFile} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {catchError, firstValueFrom, map} from "rxjs";
import * as Excel from 'exceljs'
import {createReadStream, promises as fs} from 'fs';
import {join} from 'path';
import {MosRuRequestDto, NewsDto} from "./dto/news.dto";


@Injectable()
export class NewsService {

    constructor(private readonly httpService: HttpService) {
    }

    async getAllTiNAONewsExcel(): Promise<StreamableFile> {
        const news = await this.getNewsFromMosRu()
        const TiNAONews = this.filterTiNAONews(news)
        return await this.createExcel(TiNAONews)
    }

    async getNewsFromMosRu(): Promise<NewsDto[]> {
        const result: NewsDto[] = []
        let page: number = 1
        let isEnd: boolean = false
        while (!isEnd) {
            const {data}: {
                data: MosRuRequestDto
            } = await firstValueFrom(this.httpService.post('https://gorod.mos.ru/data/news/find', {
                    page: page,
                    search: ""
                })
                    .pipe(
                        map((res) => res.data),
                        catchError((e) => {
                            throw new HttpException(e.response.data, e.response.status)
                        })
                    )
            )
            if (data?.data_page) {
                result.push(...data.data_page)
                page++
            } else {
                isEnd = true
            }
        }
        return result
    }

    filterTiNAONews(news: NewsDto[]): NewsDto[] {
        const regExp = /ТиНАО|Троицк\W{2,3}.{1,3}Новомосковск\W{2,3} административн\W{2,3} округ\W{2,3}/i
        return news.filter((news) => regExp.test(news.title) ||
            regExp.test(news.text_preview) || regExp.test(news.clearTextPreview) || regExp.test(news.text))
    }

    async createExcel(news: NewsDto[]): Promise<StreamableFile> {
        const wb = new Excel.Workbook();
        const statisticData = []
        const sheet1 = wb.addWorksheet('Новости ТиНАО');
        sheet1.addRow(['Заголовок', 'Краткое содержание', 'Дата публикации']).alignment = {
            vertical: 'middle',
            horizontal: 'center',
        }
        sheet1.getRow(1).font = {bold: true}
        sheet1.getColumn(1).width = 30
        sheet1.getColumn(2).width = 70
        sheet1.getColumn(3).width = 15
        const sheet2 = wb.addWorksheet('Статистика просмотров');
        sheet2.addRow(['Всего новостей', news.length])
        sheet2.getCell(1, 1).font = {bold: true}
        sheet2.getColumn(1).width = 15
        sheet2.addRow([])
        sheet2.addRow(['Месяц', 'Количество просмотров']).font = {bold: true}
        news.forEach((news) => {
            sheet1.addRow([news.title, news.text_preview, new Date(news.date_publish * 1000)]).alignment = {
                wrapText: true,
                vertical: 'middle',
            };
            const periodMonth = new Date(news.period_month).toLocaleDateString('ru', {
                year: 'numeric',
                month: '2-digit'
            })
            const index = statisticData.findIndex(([month]) => month === periodMonth)
            if (index !== -1) {
                statisticData[index][1] += news.count_view
            } else {
                statisticData.push([periodMonth, news.count_view])
            }
        })
        sheet2.addRows(statisticData.sort(([first], [second]) => new Date(first).getTime() - new Date(second).getTime()))
        const fileName = 'Новости ТиНАО.xlsx'
        const dirPath = join(__dirname, '..', '..', '..', 'public', 'files')
        const filePath = join(dirPath, fileName)
        await fs.mkdir(dirPath, {recursive: true})
        await wb.xlsx.writeFile(filePath)
        const file = createReadStream(filePath);
        return new StreamableFile(file, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            disposition: `attachment; filename="${encodeURIComponent(fileName)}"`,
        });
    }

}
