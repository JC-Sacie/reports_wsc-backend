import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HistoricsService {
  constructor(private readonly dataSource: DataSource) {}

  async getDynamicViewHistorics(dateStart: string, dateEnd: string) {
    
    const ViewHistorics = await this.dataSource.query(`SELECT * FROM ColumnasHistoricos`);
    
    if (ViewHistorics.length === 0) return [];

    const queries = ViewHistorics.map(({ Tabla, Columna }) => `
      SELECT 
          T.time_stamp AS Time_Stamp, 
          '${Columna}' AS TagName, 
          '${Tabla}' AS TagTable, 
          T.${Columna} AS Value
      FROM ${Tabla} AS T
      WHERE T.time_stamp BETWEEN '${dateStart}' AND '${dateEnd}'
    `);

    // Unir todas las consultas con UNION ALL
    const finalQuery = `${queries.join(' UNION ALL ')} ORDER BY Time_Stamp DESC`;

    // Ejecutar la consulta final
    return this.dataSource.query(finalQuery);
  }
}
