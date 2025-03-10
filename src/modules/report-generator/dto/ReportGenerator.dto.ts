import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
export class ReportHistoricsParams {
  @ApiProperty({ example: ["sensor1", "sensor2"], description: "Lista de tags"})
  @IsArray()
  @ArrayNotEmpty({ message: "tagNames no puede estar vacío" })
  @IsString({ each: true })
  tagNames: string[]

  @ApiProperty({ example: "2025-03-03 08:30:00", description: "Fecha de inicio en formato YYYY-MM-DD HH:mm:ss", required: false })
  @IsOptional()
  @IsString()
  dateStart?: string;

  @ApiProperty({ example: "2025-03-05 18:00:00", description: "Fecha de fin en formato YYYY-MM-DD HH:mm:ss", required: false })
  @IsOptional()
  @IsString()
  dateEnd?: string;

  @ApiProperty({ example: true, description: "Mostrar tabla en el report" })
  @IsBoolean()
  showTable: boolean;

  @ApiProperty({ example: true, description: "Mostrar gráfico en el report" })
  @IsBoolean()
  showChart: boolean;

  @ApiProperty({ example: 0, description: "0: Lineal, 1: Barras", required: false })
  @IsBoolean()
  typeChart?: number;

  /*@ApiProperty({ example: ["#0000ff", "#a03f25"], description: "Color definido por cada elemento de la grafica" })
  @IsOptional()
  @IsString({ each: true })
  graphicColors?: string[];*/

}

export class ReportAlarmsParams{
  @ApiProperty({ example: ["sensor1", "sensor2"], description: "Lista de tags", required: false})
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tagNames?: string[];

  @ApiProperty({ example: "2025-03-03 08:30:00", description: "Fecha de inicio en formato YYYY-MM-DD HH:mm:ss", required: false })
  @IsOptional()
  @IsString()
  dateStart?: string;

  @ApiProperty({ example: "2025-03-05 18:00:00", description: "Fecha de fin en formato YYYY-MM-DD HH:mm:ss", required: false })
  @IsOptional()
  @IsString()
  dateEnd?: string;

  @ApiProperty({ example: ["NombreA", "NombreB"], description: "Fecha de fin en formato YYYY-MM-DD HH:mm:ss", required: false })
  @IsOptional()
  @IsString({ each: true })
  groupNames?: string[];

  @ApiProperty({ example: ["Normalizada", "Alarma", "Normalizada no reconocida", "Reconocida"], description: "Estados posibles de las alarmas", required: false })
  @IsOptional()
  @IsString({ each: true })
  states?: string[];

  @ApiProperty({ example: true, description: "Mostrar tabla en el report" })
  @IsBoolean()
  showTable: boolean;

  @ApiProperty({ example: true, description: "Mostrar grafica en el report" })
  @IsBoolean()
  showChart: boolean;

  @ApiProperty({ example: 0, description: "0: Lineal, 1: Barras Vert., 2: Barras Horiz., 3: Radial", required: false })
  @IsNumber()
  typeChart?: number;

  /*@ApiProperty({ example: ["#0000ff", "#a03f25"], description: "Color definido por cada elemento de la grafica" })
  @IsOptional()
  @IsString({ each: true })
  graphicColors?: string[];*/

}
export interface ReportHistoricsConfig {
  data: GraphicHistoricsElement[];
  filter: ReportHistoricsParams;
}
export interface GraphicHistoricsElement {
  alias: string;
  colorGrafica: string;
  //si quiero que cada elemento tenga un color predeterminado desde front => graphicColors
  minEscala: number;
  maxEscala: number;
  muestrasHistoricos: HistoricalPoint[];
}
export interface HistoricalPoint {
  F: string; // Fecha
  V: number | null ; // Valor
}

export interface ReportAlarmsConfig {
  data: GraphicAlarmsElement[];
  filter: ReportAlarmsParams;
  totals: {
    TotalAct: number;
    TotalAck: number;
    TotalNorm: number;
    TotalNoAck: number;
  };
}
export interface GraphicAlarmsElement {
  alias: string;
  colorGrafica: string;
  //si quiero que cada elemento tenga un color predeterminado desde front => graphicColors
  minEscala: number;
  maxEscala: number;
  muestrasAlarmas: AlarmPoint[];
}
export interface AlarmPoint {
  F: string; // Fecha Evento
  T: string; // Tipo
  V: number; // Valor
  M: string; // Mensaje
  D: string; // Duracion
  U: string; // Usuario
  C: string; // Comentario
  E: string; // Estado
}
