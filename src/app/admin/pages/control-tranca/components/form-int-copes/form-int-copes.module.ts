import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormIntCopesComponent } from './form-int-copes.component';

@NgModule({
  declarations: [
    FormIntCopesComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FormIntCopesComponent // Exportamos el componente para usarlo en otros módulos
  ]
})
export class FormIntCopesModule { }