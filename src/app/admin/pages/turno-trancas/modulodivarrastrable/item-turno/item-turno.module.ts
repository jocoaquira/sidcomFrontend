import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemTurnoComponent } from './item-turno.component';

@NgModule({
  declarations: [
    ItemTurnoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ItemTurnoComponent // Si necesitas usarlo en otros módulos
  ]
  // No necesitas entryComponents en Angular 9+ (Ivy)
})
export class ItemTurnoModule { }
