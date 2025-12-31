import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditFormularioInternoComponent } from './edit-formulario-interno.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DepartamentoSelectModule } from 'src/app/admin/components/departamentoSelect/departamentoSelect.module';
import { MunicipioSelectModule } from 'src/app/admin/components/municipioSelect/municipioSelect.module';
import { MineralesSelectModule } from 'src/app/admin/components/mineralesSelect/mineralesSelect.module';
import { CheckboxModule } from 'primeng/checkbox';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { ChoferSelectModule } from 'src/app/admin/components/choferSelect/choferSelect.module';
import { VehiculoSelectModule } from 'src/app/admin/components/vehiculoSelect/vehiculoSelect.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OperadoresSelectModule } from 'src/app/admin/components/operadoresSelect/operadoresSelect.module';
import { PlantaTratamientoSelectModule } from 'src/app/admin/components/plantaTratamientoSelect/plantaTratamientoSelect.module';
import { CompradorSelectModule } from 'src/app/admin/components/compradorSelect/compradorSelect.module';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule,
    ReactiveFormsModule,
    InputSwitchModule,
	  InputTextModule,
    TableModule,
    ButtonModule,
    InputTextareaModule,
    DepartamentoSelectModule,
    MunicipioSelectModule,
    MineralesSelectModule,
    OperadoresSelectModule,
    PlantaTratamientoSelectModule,
    CompradorSelectModule,
    ChoferSelectModule,
    VehiculoSelectModule,
    CheckboxModule,
    StepsModule,
    TabMenuModule,
    FormsModule,
  ],
  declarations: [EditFormularioInternoComponent]
})
export class EditFormularioInternoModule { }
