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
import { HttpClientModule } from '@angular/common/http';
import { SafeUrlPipe } from './safe-url.pipe';
import { CardDocumentosModule } from 'src/app/admin/components/ver-components/card-documentos/card-documentos.module';
import { CardIDomModule } from 'src/app/admin/components/ver-components/card-idom/card-idom.module';
import { CardRepLegalModule } from 'src/app/admin/components/ver-components/card-rep-legal/card-rep-legal.module';


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
         DashboardRoutingModule,
        CardDocumentosModule,
        CardIDomModule,
        CardRepLegalModule


    ],
    declarations: [DashboardComponent,SafeUrlPipe]
})
export class DashboardModule { }
