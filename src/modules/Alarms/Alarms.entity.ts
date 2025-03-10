import { Time } from 'highcharts';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity('ExcelAlarmas')
export class ViewAlarmas {

  @ViewColumn()
  id: number;

  @ViewColumn({name: 'Fecha_Hora'})
  dateTime: Date;

  @ViewColumn({name: 'Tag'})
  tagName: string;

  @ViewColumn({name: 'Mensaje'})
  message: string;

  @ViewColumn({name: 'Valor'})
  value: number;

  @ViewColumn({name: 'Fecha_hora_reconocida'})
  dateTimeAck: Date | null;

  @ViewColumn({name: 'Fecha_Hora_Normalización'})
  dateTimeNormal: Date | null;

  @ViewColumn({name: 'Usuario'})
  user: string | null;

  @ViewColumn({name: 'Nombre_Grupo'})
  groupName: string;

  @ViewColumn({name: 'Comentario'})
  comment: string;

  @ViewColumn({name: 'idZona'})
  idZone: number;

  //@ViewColumn({name: 'Al_Tag'})
  //tagName: string;

  @ViewColumn({name: 'Acción'})
  state: string;

  @ViewColumn({name: 'Tipo'})
  type: string;

  @ViewColumn({name: 'selection'})
  selection: string;

  //@ViewColumn({name: 'Al_Group'})
  //idGroup: number;

  @ViewColumn({name: 'Al_Priority'})
  priority: number;

  @ViewColumn({name: 'Al_Custom1'})
  duration: Time | null;

}