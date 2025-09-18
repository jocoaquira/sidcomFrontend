import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { PlantaTratamientoSelectComponent } from './plantaTratamientoSelect.component';

@NgModule({
    exports:[
        PlantaTratamientoSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [PlantaTratamientoSelectComponent]
})
export class PlantaTratamientoSelectModule { }
