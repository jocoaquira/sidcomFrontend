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
import { VerMineralesTopInternoComponent } from './ver-minerales-top-interno.component';

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
    VerMineralesTopInternoComponent
  ],
  declarations: [VerMineralesTopInternoComponent]
})
export class VerMineralesTopInternoModule { }
