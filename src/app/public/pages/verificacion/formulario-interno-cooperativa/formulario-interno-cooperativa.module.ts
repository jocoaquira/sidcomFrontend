import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificacionFormularioInternoCooperativaComponent } from './formulario-interno-cooperativa.component';
import { VerificacionFormularioInternoCooperativaRoutingModule } from './verificacion-formulario-interno-cooperativa.routing';

@NgModule({
  imports: [
    CommonModule,
    VerificacionFormularioInternoCooperativaRoutingModule
  ],
  declarations: [VerificacionFormularioInternoCooperativaComponent]
})
export class VerificacionFormularioInternoCooperativaModule { }
