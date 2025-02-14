import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CanVerRolGuard } from "../../guards/roles/can-ver-rol.guard";
import { CanCrearRolGuard } from "../../guards/roles/can-crear-rol.guard";
import { CanEditarRolGuard } from "../../guards/roles/can-editar-rol.guard";
import { ListarRolesComponent } from "./listar-roles/listar-roles.component";
import { VerRolComponent } from "./ver-rol/ver-rol.component";
import { CrearRolComponent } from "./crear-rol/crear-rol.component";
import { EditarRolComponent } from "./editar-rol/editar-rol.component";

const routes6:Routes=[
  {
    path:'',component: ListarRolesComponent,
    //canActivate:[CanVerRolGuard]
  },
  {
    path: 'ver/:id', component:VerRolComponent,
    //canActivate:[CanVerRolGuard]
  },
  {
    path:'crear',component:CrearRolComponent,
    //canActivate:[CanCrearRolGuard]
  },
  {
    path: 'editar/:id',component:EditarRolComponent,
    //canActivate:[CanEditarRolGuard]
  }
];
@NgModule({
  imports:[RouterModule.forChild(routes6)],
  exports:[RouterModule]
})

export class RolRoutes{}

