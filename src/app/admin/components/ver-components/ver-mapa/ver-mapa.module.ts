import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerMapaComponent } from './ver-mapa.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule
  ],
  exports:[
    VerMapaComponent
  ],
  declarations: [VerMapaComponent]
})
export class VerMapaModule { }
