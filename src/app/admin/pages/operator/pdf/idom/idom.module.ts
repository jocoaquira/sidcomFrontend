import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdomComponent } from './idom.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IdomComponent],
  exports:[
    IdomComponent
  ]
})
export class IdomModule { }
