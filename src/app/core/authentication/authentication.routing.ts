import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NoAuthGuard } from "@core/guards/no-auth.guard";
import { CrearUsuarioComponent } from "./pages/crear-usuario/crear-usuario.component";
import { EditarUsuarioComponent } from "./pages/editar-usuario/editar-usuario.component";
import { LoginComponent } from "./pages/login/login.component";
import { VerUsuarioComponent } from "./pages/ver-usuario/ver-usuario.component";

const routes:Routes=[
  {
    path:'',
    component: LoginComponent,
    canActivate:[NoAuthGuard]
  },
  {
    path: 'ver/:id', component:VerUsuarioComponent,
  },
  {
    path:'crear',component:CrearUsuarioComponent,
  },
  {
    path: 'editar/:id',component:EditarUsuarioComponent,
  }
];
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})

export class AuthenticationRoutes{}
