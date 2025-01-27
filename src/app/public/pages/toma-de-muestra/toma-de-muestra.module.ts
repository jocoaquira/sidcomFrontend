import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TomaDeMuestraRoutingModule } from './toma-de-muestra.routing';
import { ListaTomaDeMuestraModule } from './lista-toma-de-muestra/lista-toma-de-muestra.module';
import { CrearTomaDeMuestraModule } from './crear-toma-de-muestra/crear-toma-de-muestra.module';
import { EditarTomaDeMuestraModule } from './editar-toma-de-muestra/editar-toma-de-muestra.module';
import { AnularTomaDeMuestraModule } from './anular-toma-de-muestra/anular-toma-de-muestra.module';

@NgModule({
  imports: [
    CommonModule,
    TomaDeMuestraRoutingModule,
    ListaTomaDeMuestraModule,
    CrearTomaDeMuestraModule,
    EditarTomaDeMuestraModule,
    AnularTomaDeMuestraModule
  ],
  declarations: []
})
export class TomaDeMuestraModule { }
