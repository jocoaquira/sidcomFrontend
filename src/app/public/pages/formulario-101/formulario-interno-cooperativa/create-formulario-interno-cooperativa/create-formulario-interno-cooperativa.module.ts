import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DepartamentoSelectModule } from 'src/app/admin/components/departamentoSelect/departamentoSelect.module';
import { MunicipioSelectModule } from 'src/app/admin/components/municipioSelect/municipioSelect.module';
import { MineralesSelectModule } from 'src/app/admin/components/mineralesSelect/mineralesSelect.module';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { RouterModule } from '@angular/router';
import { CreateFormularioInternoCooperativaComponent } from './create-formulario-interno-cooperativa.component';
import { ChoferSelectModule } from 'src/app/admin/components/choferSelect/choferSelect.module';
import { VehiculoSelectModule } from 'src/app/admin/components/vehiculoSelect/vehiculoSelect.module';
import { OperadoresSelectModule } from 'src/app/admin/components/operadoresSelect/operadoresSelect.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PlantaTratamientoSelectModule } from 'src/app/admin/components/plantaTratamientoSelect/plantaTratamientoSelect.module';

import { CompradorSelectModule } from 'src/app/admin/components/compradorSelect/compradorSelect.module';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule,
    ReactiveFormsModule,
	InputTextModule,
    InputSwitchModule,
    ChoferSelectModule,
    VehiculoSelectModule,
    TableModule,
    ButtonModule,
    InputTextareaModule,
    DepartamentoSelectModule,
    MunicipioSelectModule,
    MineralesSelectModule,
    PlantaTratamientoSelectModule,
    CompradorSelectModule,
    OperadoresSelectModule,
    CheckboxModule,
    StepsModule,
    TabMenuModule,
    FormsModule,
  ],
  declarations: [CreateFormularioInternoCooperativaComponent]
})
export class CreateFormularioInternoCooperativaModule { }
