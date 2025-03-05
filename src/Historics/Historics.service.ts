import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { ColumnasHistoricos } from 'src/Historics/Historics.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class HistoricsService {
  constructor(
    @InjectRepository(ColumnasHistoricos)
    private readonly historicsRepository: Repository<ColumnasHistoricos>
  ) { }

  async getTagsBetween_Historics(tagNames: string[], dateStart?: string, dateEnd?: string) {

    if (!tagNames || tagNames.length === 0) {
      throw new NotAcceptableException(new MessageDto('Es necesario añadir un Tag mínimo'));
    }

    const ViewHistorics = await this.historicsRepository.find();

    if (ViewHistorics.length === 0) {
      throw new NotAcceptableException(new MessageDto('La tabla está vacía'));
    }

    const filteredHistorics = ViewHistorics.filter(({ Columna }) => tagNames.includes(Columna));

    if (filteredHistorics.length === 0) return [];

    const queries = filteredHistorics.map(({ Tabla, Columna }) => {

      const whereConditions: string[] = [];

      if (dateStart) {        
        whereConditions.push(`T.time_stamp BETWEEN '${dateStart}' AND '${dateEnd ?? 'CURRENT_TIMESTAMP'}'`);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

      return `
            SELECT 
                T.time_stamp AS Time_Stamp, 
                '${Columna}' AS TagName, 
                '${Tabla}' AS TagTable, 
                T.${Columna} AS Value
            FROM ${Tabla} AS T
            ${whereClause}
        `;
    });

    const finalQuery = `${queries.join(' UNION ALL ')} ORDER BY Time_Stamp DESC`;

    return this.historicsRepository.query(finalQuery);
  }

  async getTagList_Historics(): Promise<string[]> {
    const ViewHistorics = await this.historicsRepository.find();

    return ViewHistorics.map((row: { Columna: string }) => row.Columna);
  }
}
