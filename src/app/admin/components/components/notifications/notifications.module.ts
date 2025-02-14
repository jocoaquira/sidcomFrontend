import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { NotificationsDropdownComponent } from './notifications-dropdown.component';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports:[
        NotificationsDropdownComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [NotificationsDropdownComponent]
})
export class NotificationsDropdownModule { }
