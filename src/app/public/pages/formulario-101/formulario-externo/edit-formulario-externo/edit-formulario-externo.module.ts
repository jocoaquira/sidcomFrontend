import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { EditFormularioExternoComponent } from './edit-formulario-externo.component';
import { PaisSelectModule } from 'src/app/admin/components/paisSelect/paisSelect.module';
import { AduanaSelectModule } from 'src/app/admin/components/aduanaSelect/aduanaSelect.module';
import { ChoferSelectModule } from 'src/app/admin/components/choferSelect/choferSelect.module';
import { VehiculoSelectModule } from 'src/app/admin/components/vehiculoSelect/vehiculoSelect.module';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule,
    ReactiveFormsModule,
	  InputTextModule,
    TableModule,
    ButtonModule,
    InputTextareaModule,
    DepartamentoSelectModule,
    MunicipioSelectModule,
    MineralesSelectModule,
    CheckboxModule,
    StepsModule,
    TabMenuModule,
    FormsModule,
    PaisSelectModule,
    AduanaSelectModule,
    ChoferSelectModule,
    VehiculoSelectModule,
  ],
  declarations: [EditFormularioExternoComponent]
})
export class EditFormularioExternoModule { }
