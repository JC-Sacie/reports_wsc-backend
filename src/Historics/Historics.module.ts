import { Module } from '@nestjs/common';
import { HistoricsService } from './Historics.service';
import { HistoricsController } from './Historics.controller';
import { DatabaseModule } from '../database/database.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [DatabaseModule],
  providers: [HistoricsService],
  controllers: [HistoricsController],
})
export class HistoricsModule {}
