import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MunicipioSelectComponent } from './municipioSelect.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    exports:[
        MunicipioSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule
  ],
  declarations: [MunicipioSelectComponent]
})
export class MunicipioSelectModule { }
