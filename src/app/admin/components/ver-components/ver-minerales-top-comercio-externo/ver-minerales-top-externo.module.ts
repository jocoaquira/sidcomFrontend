import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { VerMineralesTopExternoComponent } from './ver-minerales-top-externo.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ChartModule,
    StyleClassModule,
    TableModule,
    PanelMenuModule,
    ButtonModule,
    MenuModule
  ],
  exports:[
    VerMineralesTopExternoComponent
  ],
  declarations: [VerMineralesTopExternoComponent]
})
export class VerMineralesTopExternoModule { }
