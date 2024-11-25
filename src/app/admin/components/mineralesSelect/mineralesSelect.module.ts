import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MineralesSelectComponent } from './mineralesSelect.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@NgModule({
    exports:[
        MineralesSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [MineralesSelectComponent]
})
export class MineralesSelectModule { }
