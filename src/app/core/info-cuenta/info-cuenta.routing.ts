import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InfoOperadorComponent } from './info-operador/info-operador..component';
import { InfoUsuarioComponent } from './info-usuario/info-usuario..component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'operador', component: InfoOperadorComponent },
		{ path: 'usuario', component: InfoUsuarioComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class InfoCuentaRoutingModule { }
