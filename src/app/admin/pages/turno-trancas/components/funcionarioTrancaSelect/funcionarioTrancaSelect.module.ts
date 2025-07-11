import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { FuncionarioTrancaSelectComponent } from './funcionarioTrancaSelect.component';

@NgModule({
    exports:[
        FuncionarioTrancaSelectComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [FuncionarioTrancaSelectComponent]
})
export class FuncionarioTrancaSelectModule { }
