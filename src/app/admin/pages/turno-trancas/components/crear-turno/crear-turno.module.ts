import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioTrancaSelectModule } from '../funcionarioTrancaSelect/funcionarioTrancaSelect.module';
import { CrearTurnoComponent } from './crear-turno.component';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    CrearTurnoComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    FuncionarioTrancaSelectModule
  ],
  exports: [
    CrearTurnoComponent
  ]
})
export class CrearTurnoModule { }
