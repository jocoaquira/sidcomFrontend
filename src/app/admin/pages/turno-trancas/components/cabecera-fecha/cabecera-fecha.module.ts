import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabeceraFechaComponent } from './cabecera-fecha.component';

@NgModule({
  declarations: [
    CabeceraFechaComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CabeceraFechaComponent // Si necesitas usarlo en otros módulos
  ]
  // No necesitas entryComponents en Angular 9+ (Ivy)
})
export class CabeceraFechaModule { }
