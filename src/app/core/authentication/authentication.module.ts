import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { AuthenticationRoutes } from "./authentication.routing";
import { CrearUsuarioComponent } from "./pages/crear-usuario/crear-usuario.component";
import { EditarUsuarioComponent } from "./pages/editar-usuario/editar-usuario.component";
import { LoginComponent } from "./pages/login/login.component";
import { VerUsuarioComponent } from "./pages/ver-usuario/ver-usuario.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AuthenticationRoutes,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
  ],
  declarations: [
    LoginComponent,
    VerUsuarioComponent,
    EditarUsuarioComponent,
    CrearUsuarioComponent
  ],
  exports:[
  ],
  providers: []
})
export class AuthenticationModule { }
