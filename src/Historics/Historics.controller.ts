import { Controller, Get, Query } from '@nestjs/common';
import { HistoricsService } from './Historics.service';

@Controller('historics')
export class HistoricsController {
  constructor(private readonly historicsService: HistoricsService) {}

  @Get('view')
  async getViewHistorics(
    @Query('tagNames') tagNames?: string,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
  ) {
    const tagList = tagNames ? tagNames.split(',') : [];
    return this.historicsService.getTagsBetween_Historics(tagList, dateStart, dateEnd,);
  }

  @Get('tags')
  async getTagListHistorics() {
    return this.historicsService.getTagList_Historics();
  }
}
