import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificacionFormularioTrasladoColaComponent } from './formulario-cola.component';
import { VerificacionFormularioTrasladoColaRoutingModule } from './verificacion-routing.module';

@NgModule({
  imports: [
    CommonModule,
    VerificacionFormularioTrasladoColaRoutingModule
  ],
  declarations: [VerificacionFormularioTrasladoColaComponent]
})
export class VerificacionFormularioTrasladoColaModule { }
