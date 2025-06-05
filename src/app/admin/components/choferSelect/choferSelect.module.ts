import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ChoferSelectComponent } from './choferSelect.component';

@NgModule({
    exports:[
        ChoferSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [ChoferSelectComponent]
})
export class ChoferSelectModule { }
