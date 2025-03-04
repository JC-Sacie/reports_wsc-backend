import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'mssql',
        host: 'localhost\\SQLEXPRESS',
        port: 1433,
        username: 'sa',
        password: '934194644',
        database: 'HistoricoGraficos_Reports',
        autoLoadEntities: true,
        synchronize: true,
        options: {
          encrypt: false, // Desactiva SSL si es necesario
          enableArithAbort: true,
        },
        extra: {
          trustServerCertificate: true, // Evita errores de certificados
        },
      }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
