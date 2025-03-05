import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HistoricsModule } from './Historics/Historics.module';
import { ReportModule } from './Report/Report.module';
@Module({
  imports: [
    DatabaseModule, 
    HistoricsModule,
    ReportModule,
  ],
})
export class AppModule {}

