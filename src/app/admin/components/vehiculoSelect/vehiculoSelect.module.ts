import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { VehiculoSelectComponent } from './vehiculoSelect.component';

@NgModule({
    exports:[
        VehiculoSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [VehiculoSelectComponent]
})
export class VehiculoSelectModule { }
