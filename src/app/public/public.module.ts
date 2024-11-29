import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public.routing';
import { HttpClientModule } from '@angular/common/http';
import { AppLayoutModule } from './layout/app.layout.module';

@NgModule({
    exports:[
        HttpClientModule
    ],
    declarations: [],
    imports: [
        HttpClientModule,
        CommonModule,
        PublicRoutingModule,
        AppLayoutModule
    ]
})
export class PublicModule { }
