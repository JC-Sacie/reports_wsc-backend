import { Controller, Post, Body, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { ReportService } from "./ReportGenerator.service";
import { Response } from "express";
import * as fs from "fs";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { GraphicAlarmsElement, GraphicHistoricsElement, ReportAlarmsConfig, ReportAlarmsParams, ReportHistoricsConfig, ReportHistoricsParams } from "src/modules/report-generator/dto/ReportGenerator.dto";
import { HistoricsService } from "src/modules/historics/Historics.service";
import { randomColor } from "randomcolor";
import { AlarmsService } from "../Alarms/Alarms.service";
@Controller("report")
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly historicsService: HistoricsService,
    private readonly alarmsService: AlarmsService,
  ) { }

  @Post("historics")
  @ApiBody({ type: ReportHistoricsParams })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiResponse({ status: 201, description: "Reporte generado exitosamente." })
  @ApiResponse({ status: 400, description: "Solicitud incorrecta." })
  @ApiResponse({ status: 500, description: "Error interno del servidor al generar el reporte." })
  async reportHistorics(@Body() body: ReportHistoricsParams, @Res() res: Response) {
    try {
      //const filter: ReportHistoricsParams = body;

      const flatData = await this.historicsService.getViewHistorics(body.tagNames, body.dateStart, body.dateEnd);
      const graphicsData: GraphicHistoricsElement[] = transformDataToGraphicsHistorics(flatData);
      const config: ReportHistoricsConfig = { data: graphicsData, filter: body };
      const filePath = await this.reportService.generateReportHistorics(config);

      res.download(filePath, `ReportHistorics_${formattedDate()}.pdf`, (err) => {
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

  @Post("alarms")
  @ApiBody({ type: ReportAlarmsParams })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiResponse({ status: 201, description: "Reporte generado exitosamente." })
  @ApiResponse({ status: 400, description: "Solicitud incorrecta." })
  @ApiResponse({ status: 500, description: "Error interno del servidor al generar el reporte." })
  async reportAlarms(@Body() body: ReportAlarmsParams, @Res() res: Response){

    try {

    const typeChartNumber = Number(body.typeChart);

    const viewData = await this.alarmsService.getViewAlarms(body?.tagNames, body?.dateStart, body?.dateEnd, body?.groupNames, body?.states);
    const { graphics, TotalAct, TotalAck, TotalNorm, TotalNoAck } = transformDataToGraphicsAlarms(viewData);
    const config: ReportAlarmsConfig = {
      data: graphics,
      filter: body,
      totals: { TotalAct, TotalAck, TotalNorm, TotalNoAck }
    };
    const filePath = await this.reportService.generateReportAlarms(config);

    res.download(filePath, `ReportAlarms_${formattedDate()}.pdf`, (err) => {
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

function transformDataToGraphicsHistorics(rows: any[]): GraphicHistoricsElement[] {
  const graphics: GraphicHistoricsElement[] = [];
  const erroneousValue = -1.5e+40;

  rows.forEach(row => {
    // row: { Time_Stamp, TagName, TagTable, Value }
    let graphic = graphics.find(item => item.alias === row.TagName);
    if (!graphic) {
      graphic = {
        alias: row.TagName,
        colorGrafica: randomColor(),
        minEscala: Infinity,
        maxEscala: -Infinity,
        muestrasHistoricos: [],
      };
      graphics.push(graphic);
    }
    const value = Number(row.Value);

    if (value === erroneousValue) {
      // En lugar de omitir el registro, se añade con valor null
      graphic.muestrasHistoricos.push({
        F: row.Time_Stamp,
        V: null,
      });
    } else {
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

function transformDataToGraphicsAlarms(rows: any[]): {
  graphics: GraphicAlarmsElement[],
  TotalAct: number,
  TotalAck: number,
  TotalNorm: number,
  TotalNoAck: number
}{
  const graphics: GraphicAlarmsElement[] = [];
  let TotalAct = 0;
  let TotalAck = 0;
  let TotalNorm = 0;
  let TotalNoAck = 0;

  rows.forEach(row => {
    // row: { Time_Stamp, TagName, TagTable, Value }
    let graphic = graphics.find(item => item.alias === row.state);
    if (!graphic) {
      graphic = {
        alias: row.state,
        colorGrafica: randomColor(),
        minEscala: 0,
        maxEscala: -Infinity,
        muestrasAlarmas: [],
      };
      graphics.push(graphic);
    }
    const value = Number(row.value);

    graphic.muestrasAlarmas.push({
      F: row.dateTime,
      T: row.type,
      V: value,
      M: row.message,
      D: row.duration,
      U: row.user,
      C: row.comment,
      E: row.state,
    });

    if (row.state = 'Normalizada no reconocida'){
      TotalNoAck++;
    }
    if (row.state = 'Reconocida'){
      TotalAck++;
    }
    if (row.state = 'Normalizada'){
      TotalNorm++;
    }
    if (row.state = 'Alarma'){
      TotalAct++;
    }
    if ((TotalNoAck ) > row.maxEscala) {
      graphic.maxEscala = TotalNoAck;
    }
    if ((TotalAck ) > row.maxEscala) {
      graphic.maxEscala = TotalAck;
    }
    if ((TotalNorm ) > row.maxEscala) {
      graphic.maxEscala = TotalNorm;
    }
    if ((TotalAct ) > row.maxEscala) {
      graphic.maxEscala = TotalAct;
    }
  });

  graphics.forEach(graphic => {
    if (graphic.maxEscala === -Infinity) {
      graphic.maxEscala = 100;
    }
  });
 
  return {graphics, TotalAct, TotalAck, TotalNorm, TotalNoAck};
}

function formattedDate(){
  const date = new Date();
  const year = date.getFullYear();
  // getMonth() devuelve el mes en base cero, por eso se suma 1 y se formatea para tener dos dígitos
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hour}${minute}${second}`
}