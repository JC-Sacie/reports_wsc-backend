import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity('ViewHistoricos')
export class ViewHistoricos {

  @ViewColumn()
  Columna: string;

  @ViewColumn()
  Tabla: string;
}
