import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificacionFormularioTDMComponent } from './formulario-tdm.component';
import { VerificacionFormularioTDMRoutingModule } from './formulario-tdm.routing';

@NgModule({
  imports: [
    CommonModule,
    VerificacionFormularioTDMRoutingModule
  ],
  declarations: [VerificacionFormularioTDMComponent]
})
export class VerificacionFormularioTDMModule { }
