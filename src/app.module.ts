import { Module } from '@nestjs/common';
import { HistoricsModule } from './modules/historics/Historics.module';
import { ReportModule } from './modules/report-generator/ReportGenerator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [ 
    HistoricsModule,
    ReportModule,
    TypeOrmModule.forRoot({
            name: 'historicosConnection',
            type: 'mssql',
            host: 'localhost\\SQLEXPRESS',
            port: 1433,
            username: 'sa',
            password: '934194644',
            database: 'HistoricoGraficos_Reports',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
            options: {
              encrypt: false, // Desactiva SSL si es necesario
              enableArithAbort: true,
            },
            extra: {
              trustServerCertificate: true, // Evita errores de certificados
            },
          }),

          TypeOrmModule.forRoot({
            name: 'datosConnection',
            type: 'mssql',
            host: 'localhost\\SQLEXPRESS',
            port: 1433,
            username: 'sa',
            password: '934194644',
            database: 'datos_Reports',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
            options: {
              encrypt: false, // Desactiva SSL si es necesario
              enableArithAbort: true,
            },
            extra: {
              trustServerCertificate: true, // Evita errores de certificados
            },
          }),
  ],
})

export class AppModule {}