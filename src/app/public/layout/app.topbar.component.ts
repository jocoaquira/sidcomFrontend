import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '@core/authentication/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];
    overlayMenuItems = [
    ];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        public authService:AuthService,
        private router: Router
    ) {
        this.overlayMenuItems = [
            {
                label: authService.getUser.nombre_completo.toString(),
                icon: 'pi pi-user',
                routerLink: ['/public/info/usuario']
            },
            {
                label: 'Salir',
                icon: 'pi pi-sign-out',
                command: ()=>this.authService.logout()
            },
            {
                separator: true
            },
            {
                label: 'Inicio',
                icon: 'pi pi-home',
                routerLink: ['/public/']  // Navegación a ruta
            }
        ];
     }
}
