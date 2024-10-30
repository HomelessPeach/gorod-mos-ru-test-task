import {Controller, Post} from '@nestjs/common';
import { NewsService } from './news.service';


@Controller('news')
export class NewsController {
  constructor(
      private readonly newsService: NewsService
  ) {}

  @Post('TiNAO/excel')
  async getAllTiNAONewsExcel() {
    return await this.newsService.getAllTiNAONewsExcel();
  }
}
