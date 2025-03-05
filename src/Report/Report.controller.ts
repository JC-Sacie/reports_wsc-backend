import { Controller, Post, Body, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { ReportService } from "./Report.service";
import { Response } from "express";
import * as fs from "fs";
import { ApiBody } from "@nestjs/swagger";
import { ReportParams } from "src/dto/Report";

@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiBody({ type: ReportParams })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Activa validaciones de class-validator
  async downloadPdf(@Body() body: ReportParams, @Res() res: Response) {
    try {
      const { tagNames, dateStart, dateEnd } = body;

      const filePath = await this.reportService.generatePdf(tagNames, dateStart, dateEnd);

      res.download(filePath, "reporte.pdf", (err) => {
        if (err) {
          console.error("Error al descargar el archivo:", err);
          res.status(500).send("Error al descargar el archivo");
        } else {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error al eliminar el archivo:", err);
          });
        }
      });
    } catch (error) {
      res.status(500).send("Error al generar el PDF: " + error.message);
    }
  }
}
