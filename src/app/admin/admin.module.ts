import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing';
import { AppLayoutModule } from './layout/app.layout.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    exports:[
        HttpClientModule
    ],
    declarations: [],
    imports: [
        HttpClientModule,
        CommonModule,
        AdminRoutingModule,
        AppLayoutModule,
        
    ]
})
export class AdminModule { }
