import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HistoricsModule } from './Historics/Historics.module';
@Module({
  imports: [DatabaseModule, HistoricsModule],
})
export class AppModule {}

