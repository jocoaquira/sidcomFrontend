import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '@core/authentication/services/auth.service';
import { LayoutService } from './service/app.layout.service';
import { CanVerResponsableTMGuard } from 'src/app/admin/guards/responsable-tm/can-ver-responsable-tm.guard';
import { CanVerFormularioExternoGuard } from 'src/app/admin/guards/formulario-externos/can-ver-formulario-externo.guard';
import { CanVerFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-ver-formulario-interno.guard';
import { CanVerTomaDeMuestraGuard } from 'src/app/admin/guards/toma-de-muestra/can-ver-toma-de-muestra.guard';
import { CanVerFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-ver-formulario-cooperativa.guard';
import { CanVerReducidoFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-ver-reducido-formulario-cola.guard';

@Component({
    selector: 'app-menu-public',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private canVerResponsableTMGuard:CanVerResponsableTMGuard,
        private canVerFormExtGuard:CanVerFormularioExternoGuard,
        private canVerFormIntGuard:CanVerFormularioInternoGuard,
        private canVerFormCooperativaGuard:CanVerFormularioCooperativaGuard,
        private canVerTomaDeMuestraGuard:CanVerTomaDeMuestraGuard,
        private canVerFormTrasladoColaGuard:CanVerReducidoFormularioColasGuard,
        private authService:AuthService
    ) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Cuenta',
                items: [
                    { label: 'Usuario', icon: 'pi pi-fw pi-user', routerLink: ['/public/info/usuario'] },
                ]
            },
            {
                label: 'Administración',
                items: [
                    { label: 'Responsables de Toma de Muestra', icon: 'pi pi-fw pi-users', routerLink: ['/public/responsable-tm'], visible: this.canVerResponsableTMGuard.canActivate() },
                    { label: 'Choferes', icon: 'pi pi-fw pi-id-card', routerLink: ['/public/chofer'] },
                    { label: 'Vehiculos', icon: 'pi pi-fw pi-car', routerLink: ['/public/vehiculo'] },
                ]
            },
            {
                label: 'Formularios',
                items: [
                    { label: 'Formularios Internos', icon: 'pi pi-fw pi-book', routerLink: ['/public/formulario-101/formulario-interno'], visible: this.canVerFormIntGuard.canActivate() },
                    { label: 'Formularios Externos', icon: 'pi pi-fw pi-globe', routerLink: ['/public/formulario-101/formulario-externo'], visible: this.canVerFormExtGuard.canActivate() },
                    { label: 'Formulario Cooperativas', icon: 'pi pi-fw pi-slack', routerLink: ['/public/formulario-101/formulario-cooperativa'], visible: this.canVerFormCooperativaGuard.canActivate() },
                    { label: 'Formulario Traslado Colas', icon: 'pi pi-fw pi-slack', routerLink: ['/public/formulario-101/formulario-traslado-cola'], visible: this.canVerFormTrasladoColaGuard.canActivate() },
                    { label: 'Toma de Muestra', icon: 'pi pi-fw pi-file-o', routerLink: ['/public/toma-de-muestra'], visible: this.canVerTomaDeMuestraGuard.canActivate() }
                ]
            },
            {
                label: 'Reportes',
                items: [
                    { label: 'Consolidado de Reporte Externo', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/public/reporte-consolidado-form101-externo'] }
                ]
            },
        ];
    }
    cerrarSesion(){
        this.authService.logout();
      }
}


