import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartamentoSelectComponent } from './departamentoSelect.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports:[
        DepartamentoSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule
  ],
  declarations: [DepartamentoSelectComponent]
})
export class DepartamentoSelectModule { }
