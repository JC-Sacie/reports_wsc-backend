import { Controller, Get, Query } from '@nestjs/common';
import { HistoricsService } from './Historics.service';

@Controller('historics')
export class HistoricsController {
  constructor(private readonly historicsService: HistoricsService) {}

  @Get()
  async getViewHistorics(
    @Query('dateStart') dateStart: string,
    @Query('dateEnd') dateEnd: string
  ) {
    return this.historicsService.getDynamicViewHistorics(dateStart, dateEnd);
  }
}
