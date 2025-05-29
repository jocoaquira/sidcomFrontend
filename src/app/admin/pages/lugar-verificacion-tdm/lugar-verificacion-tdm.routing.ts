import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarLugarVerificacionTDMComponent } from './listar-lugar-verificacion-tdm/listar-lugar-verificacion-tdm.component';
import { CrearLugarVerificacionTDMComponent } from './crear-lugar-verificacion-tdm/crear-lugar-verificacion-tdm.component';
import { EditarLugarVerificacionTDMComponent } from './editar-lugar-verificacion-tdm/editar-lugar-verificacion-tdm.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarLugarVerificacionTDMComponent },
		{path:'crear',component:CrearLugarVerificacionTDMComponent},
        {path:'editar/:id',component:EditarLugarVerificacionTDMComponent},
	])],
	exports: [RouterModule]
})
export class LugarVerificacionTDMRoutingModule { }
