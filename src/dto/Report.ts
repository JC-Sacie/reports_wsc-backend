import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ReportParams {
  @ApiProperty({ example: ["sensor1", "sensor2"], description: "Lista de nombres de etiquetas", isArray: true })
  @IsArray()
  @IsNotEmpty({ message: "tagNames no puede estar vacío" })
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
