import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificacionFormularioExternoComponent } from './formulario-externo.component';
import { VerificacionFormularioExternoRoutingModule } from './formulario-externo.routing';

@NgModule({
  imports: [
    CommonModule,
    VerificacionFormularioExternoRoutingModule
  ],
  declarations: [VerificacionFormularioExternoComponent]
})
export class VerificacionFormularioExternoModule { }
