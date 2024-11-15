import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificacionOperadorComponent } from './verificacion-operador.component';
import { VerificacionRoutingModule } from './verificacion-routing.module';

@NgModule({
  imports: [
    CommonModule,
    VerificacionRoutingModule
  ],
  declarations: [VerificacionOperadorComponent]
})
export class VerificacionOperadorModule { }
