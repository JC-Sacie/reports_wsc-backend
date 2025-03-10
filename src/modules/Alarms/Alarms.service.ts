import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ViewAlarmas } from "./Alarms.entity";
import { Repository } from "typeorm";


@Injectable()
export class AlarmsService {
    constructor(
        @InjectRepository(ViewAlarmas, 'datosConnection')
        private readonly alarmsRepository: Repository<ViewAlarmas>
    ) {}

    async getViewAlarms(
        tagNames?: string[],
        dateStart?: string,
        dateEnd?: string,
        groupNames?: string[],
        states?: string[]
    ): Promise<ViewAlarmas[]> {
        const query = this.alarmsRepository.createQueryBuilder("viewAlarms")
            .where("viewAlarms.Al_Priority = :priority", { priority: 1 });
    
        // Filtro por tagNames (array de tags)
        if (tagNames && tagNames.length > 0) {
            query.andWhere("viewAlarms.tagName IN (:...tagNames)", { tagNames });
        }
    
        // Filtro por fecha de inicio
        if (dateStart) {
            const startDate = new Date(dateStart).toISOString();
            query.andWhere("viewAlarms.dateTime >= :dateStart", { dateStart: startDate });
        
        // Filtro por fecha de fin (si no se proporciona, se usa la fecha actual)
        const finalDate = dateEnd ? new Date(dateEnd).toISOString() : new Date().toISOString();
        query.andWhere("viewAlarms.dateTime <= :dateEnd", { dateEnd: finalDate });
        }

        // Filtro por groupNames (array de grupos)
        if (groupNames && groupNames.length > 0) {
            query.andWhere("viewAlarms.groupName IN (:...groupNames)", { groupNames });
        }
    
        // Filtro por estados (array de estados)
        if (states && states.length > 0) {
            query.andWhere("viewAlarms.state IN (:...states)", { states });
        }
    
        // Ordenar por fecha de la alarma (más reciente primero)
        query.orderBy("viewAlarms.dateTime", "DESC");
        return await query.getMany();
    }    
}