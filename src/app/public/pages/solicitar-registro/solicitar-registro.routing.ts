import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitarRegistroComponent } from './solicitar-registro.component';

const routes: Routes = [
  { path: '', component: SolicitarRegistroComponent } // <== Asegúrate de que el path esté vacío
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitarRegistroRoutingModule { }