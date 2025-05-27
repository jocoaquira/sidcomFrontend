import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '@core/authentication/services/auth.service';
import { Router } from '@angular/router';
import { TomaDeMuestraService } from '../services/toma-de-muestra/toma-de-muestra.service';
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
    cantidadTDM:number=0;
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
            this.cantidadTDM=Number(data.toString());
            console.log(this.cantidadTDM);
            this.overlayMenuItem = [
                {
                    label:'Solicitudes de Tomas de Muestra: '+ this.cantidadTDM,

                    routerLink: ['/admin/toma-de-muestra/']
                },
                {
                    separator: true
                },
                {
                    label: 'Solicitudes de Inscripción',
                    icon: 'pi pi-sign-out',
                    routerLink: ['/admin/']
                }

            ];
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
     ngOnInit() {
        // Suscripción a actualizaciones
        this.tdmNotificacion.notificaciones$.pipe(
          takeUntil(this.destroy$)
        ).subscribe(count => {
          this.cantidadTDM = count;
          this.overlayMenuItem = [
            {
                label:'Solicitudes de Tomas de Muestra: '+ this.cantidadTDM,

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
        });

        // Carga inicial
        this.tdmNotificacion.contarSolicitudesTDM().subscribe();
      }

      ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
      }
}
