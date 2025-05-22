import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '@core/authentication/services/auth.service';
import { Router } from '@angular/router';
import { TomaDeMuestraService } from '../services/toma-de-muestra/toma-de-muestra.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];
    overlayMenuItems = [];
    cantidadTDM:any;
    error:any;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        public authService:AuthService,
        public tdmNotificacion:TomaDeMuestraService,
        private router: Router
    ) {
        this.tdmNotificacion.contarSolicitudesTDM().subscribe(
            (data:any)=>{
            this.cantidadTDM=data;
            console.log(this.cantidadTDM);

          },
          (error:any)=> this.error=this.tdmNotificacion.handleError(error));
        this.overlayMenuItems = [
            {
                label: authService.getUser.nombre_completo.toString(),
                icon: 'pi pi-user',
                routerLink: ['/admin/info/usuario']
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
                routerLink: ['/admin/']  // Navegación a ruta
            }
        ];
     }
}
