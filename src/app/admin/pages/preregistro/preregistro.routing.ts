import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PreRegistroComponent } from './preregistro.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PreRegistroComponent },
	])],
	exports: [RouterModule]
})
export class PreRegistroRoutingModule { }
