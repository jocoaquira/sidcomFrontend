import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardRoutingModule } from './dashboard.routing';
import { SafeUrlPipe } from './safe-url.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { VerMineralesTopInternoModule } from '../../components/ver-components/ver-minerales-top-comercio-interno/ver-minerales-top-interno.module';
import { VerMineralesTopExternoModule } from "../../components/ver-components/ver-minerales-top-comercio-externo/ver-minerales-top-externo.module";
import { VerMineralesTopTDMModule } from "../../components/ver-components/ver-minerales-top-tdm/ver-minerales-top-tdm.module";


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
    DropdownModule,
    DashboardRoutingModule,
    VerMineralesTopInternoModule,
    VerMineralesTopExternoModule,
    VerMineralesTopTDMModule
],
    declarations: [DashboardComponent,SafeUrlPipe]
})
export class DashboardModule { }
