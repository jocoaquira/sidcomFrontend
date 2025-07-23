import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '@core/authentication/services/auth.service';
import { Router } from '@angular/router';
import { TomaDeMuestraService } from '../services/toma-de-muestra/toma-de-muestra.service';
import { WebsocketService } from '../services/websocket.service'; // Importa el servicio WebSocket
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss']
})
export class AppTopBarComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    items!: MenuItem[];
    overlayMenuItems = [];
    overlayMenuItem = [];
    cantidadTDM: number = 0;
    cantidadPreRegistro:number=0;
    error: any;

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        public authService: AuthService,
        public tdmNotificacion: TomaDeMuestraService,
        private websocketService: WebsocketService, // Inyecta el servicio WebSocket
        private router: Router
    ) {
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

    ngOnInit() {
        // Suscripción a actualizaciones desde el WebSocket
        this.websocketService.notificaciones$.pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: any) => {
            if(data.type==='solicitudes_tdm'){
                this.cantidadTDM = data.data; // Actualiza cantidadTDM con el valor recibido
                this.actualizarMenu();
            }
        });

        // Carga inicial desde el servicio
        this.tdmNotificacion.contarSolicitudesTDM().subscribe(
            (data: any) => {
                this.cantidadTDM = Number(data.toString());
                this.actualizarMenu();
            },
            (error: any) => this.error = this.tdmNotificacion.handleError(error)
        );

        // Conectar al WebSocket
        this.websocketService.connect();
        //this.websocketService.sendMessage('estadoPreregistroActualizado');
    }

    actualizarMenu() {
        this.overlayMenuItem = [
            {
                label: 'Solicitudes de Tomas de Muestra: ' + this.cantidadTDM,
                routerLink: ['/admin/toma-de-muestra/']
            },
            {
                separator: true
            },
            {
                label: 'Solicitudes de Inscripción',
                routerLink: ['/admin/']
            }
        ];
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    clickmensaje(){
        this.websocketService.sendMessage('estadoPreregistroActualizado');
    }
}
