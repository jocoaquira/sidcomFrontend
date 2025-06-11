import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { OperadoresSelectComponent } from './operadoresSelect.component';

@NgModule({
    exports:[
        OperadoresSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [OperadoresSelectComponent]
})
export class OperadoresSelectModule { }
