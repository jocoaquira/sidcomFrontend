import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '@core/authentication/services/auth.service';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService,private authService:AuthService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'ADMINISTRACION',
                items: [
                    { label: 'Operador Minero', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/operador'] },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/admin/usuario'] }
                ]
            },
            {
                label: 'Formularios',
                items: [
                    { label: 'Formularios Internos', icon: 'pi pi-fw pi-file-o', routerLink: ['/admin/formulario-101/formulario-interno'] },
                    { label: 'Formularios Externos', icon: 'pi pi-fw pi-globe', routerLink: ['/uikit/input'] },
                    { label: 'Formulario Cooperativas', icon: 'pi pi-fw pi-file-o', routerLink: ['/uikit/floatlabel'] }
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
            {
                label: 'PERMISOS',
                items: [
                    { label: 'Roles', icon: 'pi pi-fw pi-shield', routerLink: ['/utilities/icons'] },
                    { label: 'Permisos', icon: 'pi pi-fw pi-key', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                    { label: 'Usuario', icon: 'pi pi-fw pi-user-edit', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                ]
            },

        ];
    }
    cerrarSesion(){
        this.authService.logout();
      }
}
