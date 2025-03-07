import { Controller, Post, Body, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { ReportService } from "./Report.service";
import { Response } from "express";
import * as fs from "fs";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { GraphicElement, ReportConfig, ReportHistoricsParams, ReportParams } from "src/dto/Report.dto";
import { HistoricsService } from "src/Historics/Historics.service";

@Controller("report")
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly historicsService: HistoricsService
  ) { }

  @Post("historics")
  @ApiBody({ type: ReportHistoricsParams })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiResponse({ status: 201, description: "Reporte generado exitosamente." })
  @ApiResponse({ status: 400, description: "Solicitud incorrecta." })
  @ApiResponse({ status: 500, description: "Error interno del servidor al generar el reporte." })
  async reportHistorics(@Body() body: ReportHistoricsParams, @Res() res: Response) {
    try {
      const filter: ReportHistoricsParams = body;

      const flatData = await this.historicsService.getTagsBetween_Historics(body.tagNames, body.dateStart, body.dateEnd);
      const graphicsData: GraphicElement[] = transformDataToGraphics(flatData);
      const config: ReportConfig = { data: graphicsData, filter: body };
      const filePath = await this.reportService.generateReport(config);


      res.download(filePath, "ReportHistorics.pdf", (err) => {
        if (err) {
          console.error("Error al descargar el archivo:", err);
          return res.status(500).send("Error al descargar el archivo");
        }
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error al eliminar el archivo:", err);
        });
      });
    } catch (error) {
      res.status(500).send("Error al generar el PDF: " + error.message);
    }
  }

}

function transformDataToGraphics(rows: any[]): GraphicElement[] {
  const graphics: GraphicElement[] = [];
  const erroneousValue = -1.5e+40;

  rows.forEach(row => {
    // row: { Time_Stamp, TagName, TagTable, Value }
    let graphic = graphics.find(item => item.alias === row.TagName);
    if (!graphic) {
      graphic = {
        alias: row.TagName,
        // Asigna un color, minEscala y maxEscala según tu lógica o valores predeterminados
        colorGrafica: '#0000FF',
        minEscala: Infinity,
        maxEscala: -Infinity,
        muestrasHistoricos: [],
      };
      graphics.push(graphic);
    }
    const value = Number(row.Value);
    
    if (value === erroneousValue) {
      return; // Se ignora este registro
    }
    graphic.muestrasHistoricos.push({
      F: row.Time_Stamp,
      V: value,
    });

    if (value < graphic.minEscala) {
      graphic.minEscala = value;
    }
    if (value > graphic.maxEscala) {
      graphic.maxEscala = value;
    }
  });

  graphics.forEach(graphic => {
    if (graphic.minEscala === Infinity) {
      graphic.minEscala = 0;
    }
    if (graphic.maxEscala === -Infinity) {
      graphic.maxEscala = 100;
    }
  });

  return graphics;
}