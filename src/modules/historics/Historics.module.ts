import { Module } from '@nestjs/common';
import { HistoricsService } from './Historics.service';
import { HistoricsController } from './Historics.controller';
import { ColumnasHistoricos } from './Historics.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([ColumnasHistoricos]),
    ],
    providers: [HistoricsService],
    controllers: [HistoricsController],
    exports: [HistoricsService],
})
export class HistoricsModule { }
