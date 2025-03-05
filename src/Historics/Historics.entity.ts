import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity('ColumnasHistoricos')
export class ColumnasHistoricos {

  @ViewColumn()
  Columna: string;

  @ViewColumn()
  Tabla: string;
}
