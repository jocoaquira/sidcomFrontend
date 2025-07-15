import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CrearOperadorComponent } from './crear-operador-validacion/crear-operador.component';
import { OperatorComponent } from './operator.component';
import { EditarOperadorComponent } from './editar-operador/editar-operador.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: OperatorComponent },
		{path:'crear',component:CrearOperadorComponent},
        {path:'editar/:id',component:EditarOperadorComponent}
	])],
	exports: [RouterModule]
})
export class OperatorRoutingModule { }
