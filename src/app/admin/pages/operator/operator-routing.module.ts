import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OperatorComponent } from './operator.component';
import { CrearOperadorComponent } from './crear-operador/crear-operador.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: OperatorComponent },
		{path:'crear',component:CrearOperadorComponent}
	])],
	exports: [RouterModule]
})
export class OperatorRoutingModule { }
