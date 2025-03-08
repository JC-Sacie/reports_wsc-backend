import { Module } from '@nestjs/common';
import { ReportService } from './ReportGenerator.service';
import { ReportController } from './ReportGenerator.controller';
import { HistoricsModule } from 'src/modules/historics/Historics.module';

@Module({
  imports: [HistoricsModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
