import { Module } from '@nestjs/common';
import { ReportService } from './Report.service';
import { ReportController } from './Report.controller';
import { HistoricsModule } from 'src/Historics/Historics.module';

@Module({
  imports: [HistoricsModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
