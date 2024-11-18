import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MineralesSelectComponent } from './mineralesSelect.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    exports:[
        MineralesSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule
  ],
  declarations: [MineralesSelectComponent]
})
export class MineralesSelectModule { }
