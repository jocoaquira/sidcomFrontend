import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CambiarPasswordComponent } from './cambiar-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

const routes: Routes = [
  { path: '', component: CambiarPasswordComponent }
];

@NgModule({
  declarations: [CambiarPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    RouterModule.forChild(routes) // Carga las rutas del módulo
  ],
  exports: [CambiarPasswordComponent]
})
export class CambiarPasswordModule { }
