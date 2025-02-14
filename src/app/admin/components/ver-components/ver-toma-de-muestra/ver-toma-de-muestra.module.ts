import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerTomaDeMuestraComponent } from './ver-toma-de-muestra.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports:[
    VerTomaDeMuestraComponent
  ],
  declarations: [VerTomaDeMuestraComponent]
})
export class VerTomaDeMuestraModule { }
