import { Injectable, BadRequestException, NotAcceptableException, InternalServerErrorException, Catch } from "@nestjs/common";
import * as path from "path";
import * as puppeteer from "puppeteer";
import * as fs from "fs-extra";
import * as handlebars from "handlebars";
import { HistoricsService } from "src/modules/historics/Historics.service";
import { HistoricalPoint, ReportConfig, ReportHistoricsParams, GraphicElement } from "src/modules/report-generator/dto/ReportGenerator.dto";
import Highcharts from "highcharts";
import moment from "moment-timezone";

@Injectable()
export class ReportService {
  chartOptions: Highcharts.Options[] = [];
  graphics: GraphicElement[];
  yAxis: Highcharts.YAxisOptions | Highcharts.YAxisOptions[] | undefined = {
    title: {
      text: "",
    },
    showEmpty: false,
    crosshair: true,
    labels: {
      style: {
        "white-space": "nowrap",
        overflow: "hidden",
        "text-overflow": "ellipsis",
        color: "black",
        "font-family": "Roboto, sans-serif",
        "font-weight": "400",
        "font-size": "0.75rem",
        "letter-spacing": "0rem",
        "line-height": "1rem",
      },
    },
    startOnTick: true,
  };
  constructor() {
    this.registerHelpers();
    this.registerPartials();
  }

  private registerHelpers() {
    handlebars.registerHelper("json", (context) => JSON.stringify(context));
    handlebars.registerHelper("toUpperCase", (text: string) =>
      text.toUpperCase()
    );

    handlebars.registerHelper("formatDate", (dateString) => {
      if (!dateString) return "Sin fecha";
      const date = new Date(dateString);
      return date.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    });
  }

  private async registerPartials() {
   try{ 
    const partialsDir = path.join(__dirname, "../../../views/partials");
    const files = await fs.readdir(partialsDir);

    for (const file of files) {
      if (file.endsWith(".hbs")) {
        const name = path.basename(file, ".hbs");
        const content = await fs.readFile(
          path.join(partialsDir, file),
          "utf-8"
        );
        handlebars.registerPartial(name, content);
      }
    }
  } catch (error) {
    console.error("Error Register Partials:", error.message);
    throw new InternalServerErrorException("Error Register Partials:");
  }
  }

  async generateReport(config: ReportConfig): Promise<string> {  
    try {
    const templatePath = path.join(__dirname, "../../../views/Report.hbs");
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const template = handlebars.compile(templateContent);

    const { chart, data, showTable, showChart } = this.buildDataTemplate(config);
    const htmlContent = template({ chart, data, showTable, showChart });
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const outputPath = path.join(__dirname, "../../../", "views", "file.pdf");
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: { top: "40px", right: "16px", bottom: "40px", left: "16px" },
    });
    await browser.close();
    return outputPath;
  } catch (error) {
    console.error("Error al generar el reporte PDF:", error.message);
    throw new InternalServerErrorException("Se produjo un error al generar el reporte PDF.");
  }
  }

  private buildDataTemplate(config: ReportConfig) {
    let chart;
    if (config?.filter.showChart) {
      this.graphics = config.data as GraphicElement[];
      chart = this.generateChart();
    }

    let table: any[] = [];

    if (config?.filter?.showTable) {
      table = config.data.reduce((accu: any[], curr: any) => {
        let existingItem = accu.find((item) => item.alias === curr.alias);
    
        if (!existingItem) {
          existingItem = {
            alias: curr.alias,
            color: curr.colorGrafica,
            unit: curr.unidades,
            items: [],
          };
          accu.push(existingItem);
        }
    
        existingItem.items.push(
          ...curr.muestrasHistoricos.map((item) => ({
            valor: item.V,
            fechaUtc: item.F,
          }))
        );

        return accu;
      }, []);
    } else {
      table = [];
    }
    
    return {
      chart,
      data: {
        filter: config.filter,
        table,
      },
      showTable: config.filter.showTable,
      showChart: config.filter.showChart,
    };
  }
  
  private generateChart(): any {
    const seriesData = this.generateSeries(); // seriesData es un arreglo de series
  
    this.chartOptions = [];
  
    this.chartOptions.push({
      colorAxis: {
        minColor: "#4572A7",
        maxColor: "#90499B",
      },
      chart: {
        type: "line",
        marginTop: 50,
        showAxes: true,
      },
      title: {
        text: "",
      },
      legend: {
        enabled: true,
      },
      xAxis: {
        type: "datetime",
        title: {
          text: "Fecha",
        },
        crosshair: true,
        labels: {
          style: {
            "white-space": "nowrap",
            overflow: "hidden",
            "text-overflow": "ellipsis",
            color: "black",
            "font-family": "Roboto, sans-serif",
            "font-weight": "400",
            "font-size": "0.75rem",
            "letter-spacing": "0rem",
            "line-height": "1rem",
          },
        },
      },
      yAxis: this.yAxis,
      series: seriesData, // Asigna directamente el arreglo de series
      credits: {
        enabled: false,
      },
    });
  
    return this.chartOptions[0];
  }

  private generateSeries(): Highcharts.SeriesLineOptions[] {
    const series: Highcharts.SeriesLineOptions[] = [];
    this.graphics.forEach((element) => {
      // Ordena los datos por fecha
      element?.muestrasHistoricos?.sort(
        (a, b) =>
          new Date(a.F as string).getTime() - new Date(b.F as string).getTime()
      );
  
      series.push({
        type: "line",
        name: element.alias as string,
        data: element?.muestrasHistoricos?.map((muestra: HistoricalPoint) => [
          moment(muestra.F as string).utc(true).valueOf(),
          muestra.V ?? undefined,
        ]),
        color: element.colorGrafica as string,
        yAxis: 0,
        connectNulls: false, // Aquí se establece que NO se conecten los puntos nulos
      });
  
      // Puedes configurar el eje Y en función de cada serie si es necesario
      this.yAxis = [
        {
          title: {
            text: "",
          },
          crosshair: true,
          labels: {
            style: {
              color: "black",
              "white-space": "nowrap",
              overflow: "hidden",
              "text-overflow": "ellipsis",
              "font-family": "Roboto, sans-serif",
              "font-weight": "400",
              "font-size": "0.75rem",
              "letter-spacing": "0rem",
              "line-height": "1rem",
            },
          },
          min: element.minEscala,
          max: element.maxEscala,
          showEmpty: false,
          startOnTick: true,
        },
      ];
    });
  
    return series;
  }
}
