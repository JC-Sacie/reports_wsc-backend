import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ReportParams {
  @ApiProperty({ example: ["sensor1", "sensor2"], description: "Lista de nombres de etiquetas", isArray: true })
  @IsArray()
  @ArrayNotEmpty({ message: "tagNames no puede estar vacío" })
  @IsString({ each: true })
  tagNames: string[];

  @ApiProperty({ example: "2024-03-05 08:30:00", required: false, description: "Fecha de inicio en formato YYYY-MM-DD HH:MM:SS" })
  @IsOptional()
  @IsString()
  dateStart?: string;

  @ApiProperty({ example: "2024-03-05 18:00:00", required: false, description: "Fecha de fin en formato YYYY-MM-DD HH:MM:SS" })
  @IsOptional()
  @IsString()
  dateEnd?: string;
}

export class ReportHistoricsParams_v1 {
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
}

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
}
export interface ReportConfig {
  data: GraphicElement[];
  filter: ReportHistoricsParams;
}
export interface GraphicElement {
  alias: string;
  colorGrafica: string;
  minEscala: number;
  maxEscala: number;
  muestrasHistoricos: HistoricalPoint[];
}
export interface HistoricalPoint {
  F: string; // Fecha
  V: number | null ; // Valor
}
