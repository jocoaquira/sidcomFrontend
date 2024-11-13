import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatorRoutingModule } from './pages/operator/operator-routing.module';
import { AdminRoutingModule } from './admin-routing.module';
import { OperatorModule } from './pages/operator/operator.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        AdminRoutingModule,
        OperatorModule
    ]
})
export class AdminModule { }
