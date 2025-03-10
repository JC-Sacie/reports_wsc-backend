import { Module } from '@nestjs/common';
import { HistoricsService } from './Historics.service';
import { ViewHistoricos } from './Historics.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([ViewHistoricos], 'historicosConnection'),
    ],
    providers: [HistoricsService],
    exports: [HistoricsService],
})
export class HistoricsModule { }
