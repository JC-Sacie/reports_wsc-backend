import { TypeOrmModule } from "@nestjs/typeorm";
import { ViewAlarmas } from "./Alarms.entity";
import { AlarmsService } from "./Alarms.service";
import { Module } from "@nestjs/common";


@Module({
    imports: [
        TypeOrmModule.forFeature([ViewAlarmas], 'datosConnection'),
    ],
    providers: [AlarmsService],
    exports: [AlarmsService],
})
export class AlarmsModule { }