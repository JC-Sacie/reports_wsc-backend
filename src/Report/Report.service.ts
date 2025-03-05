import { Injectable, BadRequestException } from "@nestjs/common";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import { HistoricsService } from "src/Historics/Historics.service";

@Injectable()
export class ReportService {
  constructor(private readonly historicsService: HistoricsService) {}

  async generatePdf(tagNames: string[], dateStart?: string, dateEnd?: string): Promise<string> {
    try {
      if (!tagNames || tagNames.length === 0) {
        throw new BadRequestException("Debes proporcionar al menos un TagName.");
      }

      const data = await this.historicsService.getTagsBetween_Historics(tagNames, dateStart, dateEnd);

      if (!data || data.length === 0) {
        throw new Error("No hay datos para generar el reporte.");
      }

      const templatePath = path.join(process.cwd(), "views", "report.hbs");
      const templateContent = fs.readFileSync(templatePath, "utf-8");

      const template = handlebars.compile(templateContent);
      const htmlContent = template({ data });

      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      const outputPath = path.join(process.cwd(), "views", `ReportPDF-${Date.now()}.pdf`);
      await page.pdf({ path: outputPath, format: "A4" });

      await browser.close();
      return outputPath;
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      throw new Error("Error al generar el PDF");
    }
  }
}
