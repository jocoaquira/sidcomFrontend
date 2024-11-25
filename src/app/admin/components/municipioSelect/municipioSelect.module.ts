import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MunicipioSelectComponent } from './municipioSelect.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@NgModule({
    exports:[
        MunicipioSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [MunicipioSelectComponent]
})
export class MunicipioSelectModule { }
