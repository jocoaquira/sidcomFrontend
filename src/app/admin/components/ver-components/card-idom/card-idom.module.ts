import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from './safe-url.pipe';
import { CardIDomComponent } from './card-idom.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[
    CardIDomComponent
    ],
  declarations: [
    CardIDomComponent, 
    SafeUrlPipe
  ]
})
export class CardIDomModule { }
