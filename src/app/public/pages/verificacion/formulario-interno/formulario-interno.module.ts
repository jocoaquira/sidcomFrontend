import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificacionFormularioInternoComponent } from './formulario-interno.component';
import { VerificacionFormularioInternoRoutingModule } from './verificacionformulario-interno.routing';

@NgModule({
  imports: [
    CommonModule,
    VerificacionFormularioInternoRoutingModule
  ],
  declarations: [VerificacionFormularioInternoComponent]
})
export class VerificacionFormularioInternoModule { }
