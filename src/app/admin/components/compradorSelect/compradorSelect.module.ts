import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CompradorSelectComponent } from './compradorSelect.component';

@NgModule({
    exports:[
        CompradorSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [CompradorSelectComponent]
})
export class CompradorSelectModule { }
