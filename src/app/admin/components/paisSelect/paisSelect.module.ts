import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { PaisSelectComponent } from './paisSelect.component';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports:[
        PaisSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [PaisSelectComponent]
})
export class PaisSelectModule { }
