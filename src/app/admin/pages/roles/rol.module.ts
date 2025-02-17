import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RolRoutes } from "./rol.routing";
import { CrearRolComponent } from "./crear-rol/crear-rol.component";
import { EditarRolComponent } from "./editar-rol/editar-rol.component";
import { VerRolComponent } from "./ver-rol/ver-rol.component";
import { ListarRolesComponent } from "./listar-roles/listar-roles.component";
import { TableModule } from "primeng/table";
import { FileUploadModule } from "primeng/fileupload";
import { ButtonModule } from "primeng/button";
import { BadgeModule } from "primeng/badge";
import { TagModule } from "primeng/tag";
import { RippleModule } from "primeng/ripple";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { RatingModule } from "primeng/rating";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";
import { ListarRolesModule } from "./listar-roles/listar-roles.module";
import { CreateRolModule } from "./crear-rol/crear-rol.module";
import { EditarRolModule } from "./editar-rol/editar-rol.module";

@NgModule({
  exports:[
  ],
  imports:[
    TableModule,
    FileUploadModule,
    ButtonModule,
    BadgeModule,
    TagModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,

    CommonModule,
    FormsModule,
    RolRoutes,
    ListarRolesModule,
    CreateRolModule,
    EditarRolModule
  ],
  declarations:[
  ],

  providers:[],
})
export class RolModule{
  constructor(){}
}
