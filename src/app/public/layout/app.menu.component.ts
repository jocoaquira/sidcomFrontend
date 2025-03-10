import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '@core/authentication/services/auth.service';
import { LayoutService } from './service/app.layout.service';
import { CanVerResponsableTMGuard } from 'src/app/admin/guards/responsable-tm/can-ver-responsable-tm.guard';
import { CanVerFormularioExternoGuard } from 'src/app/admin/guards/formulario-externos/can-ver-formulario-externo.guard';
import { CanVerFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-ver-formulario-interno.guard';
import { CanVerTomaDeMuestraGuard } from 'src/app/admin/guards/toma-de-muestra/can-ver-toma-de-muestra.guard';
import { CanVerFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-ver-formulario-cooperativa.guard';

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
        private authService:AuthService
    ) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Adminsitracion',
                items: [
                    { label: 'Responsables de Toma de Muestra', icon: 'pi pi-fw pi-users', routerLink: ['/public/responsable-tm'],visible: this.canVerResponsableTMGuard.canActivate() },
                    { label: 'Usuario', icon: 'pi pi-fw pi-user', routerLink: ['/uikit/input'] },
                ]
            },
            {
                label: 'Formularios',
                items: [
                    { label: 'Formularios Internos', icon: 'pi pi-fw pi-book', routerLink: ['/public/formulario-101/formulario-interno'],visible: this.canVerFormIntGuard.canActivate() },
                    { label: 'Formularios Externos', icon: 'pi pi-fw pi-globe', routerLink: ['/public/formulario-101/formulario-externo'],visible: this.canVerFormExtGuard.canActivate() },
                    { label: 'Formulario Cooperativas', icon: 'pi pi-fw pi-slack', routerLink: ['/public/formulario-101/formulario-cooperativa'],visible: this.canVerFormCooperativaGuard.canActivate() },
                    { label: 'Toma de Muestra', icon: 'pi pi-fw pi-file-o', routerLink: ['/public/toma-de-muestra'],visible: this.canVerTomaDeMuestraGuard.canActivate() }
                ]
            },
            {
                label: 'REPORTES',
                items: [
                    { label: 'Operadores Mineros', icon: 'pi pi-fw pi-id-card', routerLink: ['/blocks'], badge: 'NEW' },
                    { label: 'Formularios Interno', icon: 'pi pi-fw pi-file-o', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
                    { label: 'Formularios Externo', icon: 'pi pi-fw pi-globe', routerLink: ['/utilities/icons'] },
                    { label: 'Formularios Cooperativas', icon: 'pi pi-fw pi-file-o', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                ]
            },

        ];
    }
    cerrarSesion(){
        this.authService.logout();
      }
}
