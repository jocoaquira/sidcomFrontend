import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from './safe-url.pipe';
import { CardRepLegalComponent } from './card-rep-legal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[
    CardRepLegalComponent
    ],
  declarations: [
    CardRepLegalComponent, 
    SafeUrlPipe
  ]
})
export class CardRepLegalModule { }
