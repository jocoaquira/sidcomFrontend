import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioTrancaSelectModule } from '../funcionarioTrancaSelect/funcionarioTrancaSelect.module';
import { CrearTurnoComponent } from './crear-turno.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    CrearTurnoComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ToastModule,
    FuncionarioTrancaSelectModule
  ],
  exports: [
    CrearTurnoComponent
  ]
})
export class CrearTurnoModule { }
