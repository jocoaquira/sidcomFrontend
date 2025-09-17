import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarPlantaDeTratamientoComponent } from './listar-planta-tratamiento/listar-planta-tratamiento.component';
import { CrearPlantaDeTratamientoComponent } from './crear-planta-tratamiento/crear-planta-tratamiento.component';
import { EditarPlantaDeTratamientoComponent } from './editar-planta-tratamiento/editar-planta-tratamiento.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarPlantaDeTratamientoComponent },
		{path:'crear',component:CrearPlantaDeTratamientoComponent},
        {path:'editar/:id',component:EditarPlantaDeTratamientoComponent},
	])],
	exports: [RouterModule]
})
export class PlantaDeTratamientoRoutingModule { }
