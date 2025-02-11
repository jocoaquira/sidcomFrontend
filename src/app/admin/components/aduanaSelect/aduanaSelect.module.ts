import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AduanaSelectComponent } from './aduanaSelect.component';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports:[
        AduanaSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [AduanaSelectComponent]
})
export class AduanaSelectModule { }
