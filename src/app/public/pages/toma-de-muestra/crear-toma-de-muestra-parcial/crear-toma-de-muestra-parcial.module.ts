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
import { DialogModule } from 'primeng/dialog';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AduanaSelectModule } from 'src/app/admin/components/aduanaSelect/aduanaSelect.module';
import { PaisSelectModule } from 'src/app/admin/components/paisSelect/paisSelect.module';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { RouterModule } from '@angular/router';
import { CrearTomaDeMuestraParcialComponent } from './crear-toma-de-muestra-parcial.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { VerTomaDeMuestraModule } from 'src/app/admin/components/ver-components/ver-toma-de-muestra/ver-toma-de-muestra.module';
import { AprobarProcedimientoModule } from 'src/app/admin/components/aprobar-procedimiento/aprobar-procedimiento.module';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule,
    ReactiveFormsModule,
    InputTextModule,
    TableModule,
    InputSwitchModule,
    ButtonModule,
    InputTextareaModule,
    DepartamentoSelectModule,
    MunicipioSelectModule,
    MineralesSelectModule,
    CheckboxModule,
    StepsModule,
    TabMenuModule,
    FormsModule,
    DialogModule,
    LeafletModule,
    CalendarModule,
    PaisSelectModule,
    AduanaSelectModule,
    CardModule,
    TagModule,
    MessageModule,
    DividerModule,
    ConfirmDialogModule,
    VerTomaDeMuestraModule,
    AprobarProcedimientoModule,
    RouterModule

  ],
  declarations: [CrearTomaDeMuestraParcialComponent],
  exports: [CrearTomaDeMuestraParcialComponent]
})
export class CrearTomaDeMuestraParcialModule { }
