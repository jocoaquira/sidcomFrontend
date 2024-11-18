import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateFormularioInternoComponent } from './create-formulario-interno.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DepartamentoSelectModule } from 'src/app/admin/components/departamentoSelect/departamentoSelect.module';
import { MunicipioSelectModule } from 'src/app/admin/components/municipioSelect/municipioSelect.module';
import { MineralesSelectModule } from 'src/app/admin/components/mineralesSelect/mineralesSelect.module';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';

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
    CheckboxModule
  ],
  declarations: [CreateFormularioInternoComponent]
})
export class CreateFormularioInternoModule { }
