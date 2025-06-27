import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ListarTurnoTrancasModule } from "./listar-turno-trancas/listar-turno-trancas.module";
import { TurnoTrancaRoutingModule } from "./turno-trancas.routing";

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,

        ListarTurnoTrancasModule,
        TurnoTrancaRoutingModule
    ],
    declarations: [],
})
export class TurnoTrancaModule { }
