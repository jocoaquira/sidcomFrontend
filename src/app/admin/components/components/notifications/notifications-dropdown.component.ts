import { Component } from '@angular/core';

@Component({
    selector: 'app-notifications-dropdown',
    templateUrl: './notifications-dropdown.component.html',
    styleUrls: ['./notifications-dropdown.component.scss']  // Estilos específicos para este componente
})
export class NotificationsDropdownComponent {
    notifications: string[] = ['Notificación 1', 'Notificación 2', 'Notificación 3'];
}