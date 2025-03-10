import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { ViewHistoricos } from 'src/modules/historics/Historics.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoricsService {
  constructor(
    @InjectRepository(ViewHistoricos, 'historicosConnection')
    private readonly historicsRepository: Repository<ViewHistoricos>
  ) { }

  async getViewHistorics(tagNames: string[], dateStart?: string, dateEnd?: string) {
    if (!tagNames || tagNames.length === 0) {
      throw new NotAcceptableException(new MessageDto('Es necesario añadir un Tag mínimo'));
    }
  
    // Obtenemos la configuración de historics (con las propiedades Tabla y Columna)
    const viewHistorics = await this.historicsRepository.find();
  
    if (viewHistorics.length === 0) {
      throw new NotAcceptableException(new MessageDto('La tabla está vacía'));
    }
  
    // Filtramos los historics por los tagNames especificados
    const filteredHistorics = viewHistorics.filter(({ Columna }) => tagNames.includes(Columna));
  
    if (filteredHistorics.length === 0) return [];
  
    // Construir cada subconsulta con QueryBuilder
    const subqueries = filteredHistorics.map(({ Tabla, Columna }) => {
      const qb = this.historicsRepository.manager.createQueryBuilder();
      qb.select("T.time_stamp", "Time_Stamp")
        .addSelect(`'${Columna}'`, "TagName")
        .addSelect(`'${Tabla}'`, "TagTable")
        .addSelect(`T.${Columna}`, "Value")
        .from(Tabla, "T");
  
      if (dateStart) {
        const startDate = new Date(dateStart).toISOString();
        qb.andWhere("T.time_stamp >= :dateStart", { dateStart: startDate });
      }
  
      if (dateEnd) {
        const endDate = new Date(dateEnd).toISOString();
        qb.andWhere("T.time_stamp <= :dateEnd", { dateEnd });
      } else {
        qb.andWhere("T.time_stamp <= CURRENT_TIMESTAMP");
      }
  
      return qb.getQuery();
    });
  
    // Combinar los subqueries utilizando UNION ALL y ordenar por Time_Stamp de forma descendente
    const finalQuery = `${subqueries.join(" UNION ALL ")} ORDER BY Time_Stamp DESC`;
  
    // Ejecutar la consulta final
    return this.historicsRepository.query(finalQuery);
  }

  async getTagList_Historics(): Promise<string[]> {
    const ViewHistorics = await this.historicsRepository.find();

    return ViewHistorics.map((row: { Columna: string }) => row.Columna);
  }
}
