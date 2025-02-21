import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDocumentosComponent } from './card-documentos.component';
import { SafeUrlPipe } from './safe-url.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[
    CardDocumentosComponent
    ],
  declarations: [
    CardDocumentosComponent, 
    SafeUrlPipe
  ]
})
export class CardDocumentosModule { }
