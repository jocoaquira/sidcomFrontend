
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '@core/authentication/services/auth.service';
import { CanVerAduanaGuard } from '../guards/aduanas/can-ver-aduana.guard';
import { CanVerFormularioExternoGuard } from '../guards/formulario-externos/can-ver-formulario-externo.guard';
import { CanVerFormularioInternoGuard } from '../guards/formulario-internos/can-ver-formulario-interno.guard';
import { CanVerMineralGuard } from '../guards/minerales/can-ver-mineral.guard';
import { CanVerOperatorGuard } from '../guards/operators/can-ver-operator.guard';
import { CanVerPaisGuard } from '../guards/paises/can-ver-pais.guard';
import { CanVerPermisoGuard } from '../guards/permisos/can-ver-permiso.guard';
import { CanVerPresentacionGuard } from '../guards/presentaciones/can-ver-presentacion.guard';
import { CanVerProcedimientoGuard } from '../guards/procedimientos/can-ver-procedimiento.guard';
import { CanVerResponsableSenarecomGuard } from '../guards/responsable-senarecom/can-ver-responsable-senarecom.guard';
import { CanVerResponsableTMGuard } from '../guards/responsable-tm/can-ver-responsable-tm.guard';
import { CanVerRolGuard } from '../guards/roles/can-ver-rol.guard';
import { CanVerUsuarioGuard } from '../guards/usuarios/can-ver-usuario.guard';
import { LayoutService } from './service/app.layout.service';
import { CanVerDepartamentoGuard } from '../guards/departamentos/can-ver-departamento.guard';
import { CanVerMunicipioGuard } from '../guards/municipios/can-ver-municipio.guard';
import { CanVerTomaDeMuestraGuard } from '../guards/toma-de-muestra/can-ver-toma-de-muestra.guard';
import { CanVerFormularioCooperativaGuard } from '../guards/formulario-cooperativas/can-ver-formulario-cooperativa.guard';
import { CanListarLugarVerificacionTDMGuard } from '../guards/lugar-verificacion-tdm/can-listar-lugar-verificacion-tdm.guard';
import { CanVerChoferGuard } from '../guards/chofer/can-ver-chofer.guard';
import { CanVerVehiculoGuard } from '../guards/vehiculo/can-ver-vehiculo.guard';
import { CanVerTrancaGuard } from '../guards/tranca/can-ver-tranca.guard';
import { CanVercontrolTrancaGuard } from '../guards/control_tranca/can-ver-control_tranca.guard';
import { CanVerTurnoTrancaGuard } from '../guards/turno-tranca/can-ver-turno-tranca.guard';
import { CanListarPreRegistroGuard } from '../guards/preregistro/can-listar-preregistro.guard';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private authService:AuthService,
        private canVerOperatorGuard:CanVerOperatorGuard,
        private canVerUsuarioGuard:CanVerUsuarioGuard,
        private canVerResponsableTMGuard:CanVerResponsableTMGuard,
        private canVerResponsableSenarecomGuard:CanVerResponsableSenarecomGuard,
        private canVerPresentacionGuard:CanVerPresentacionGuard,
        private canVerProcedimientoGuard:CanVerProcedimientoGuard,
        private canVerAduanaGuard:CanVerAduanaGuard,
        private canVerPaisGuard:CanVerPaisGuard,
        private canVerMineralGuard:CanVerMineralGuard,
        private canVerFormExtGuard:CanVerFormularioExternoGuard,
        private canVerFormIntGuard:CanVerFormularioInternoGuard,
        private canVerFormCooperativaGuard:CanVerFormularioCooperativaGuard,
        private canVerRolGuard:CanVerRolGuard,
        private canVerPermisoGuard:CanVerPermisoGuard,
        private canVerDepartamentoGuard:CanVerDepartamentoGuard,
        private canVerMunicipioGuard:CanVerMunicipioGuard,
        private canVerChoferGuard:CanVerChoferGuard,
        private canVerTrancaGuard:CanVerTrancaGuard,
        private canVerTurnoTrancaGuard:CanVerTurnoTrancaGuard,
        private canVerControlTrancaGuard:CanVercontrolTrancaGuard,
        private canVerVehiculoGuard:CanVerVehiculoGuard,
        private canVerTomaDeMuestraGuard:CanVerTomaDeMuestraGuard,
        private canListarLugarVerificacionTDMGuard:CanListarLugarVerificacionTDMGuard,
        private canListarPreRegistroGuard:CanListarPreRegistroGuard
        ) { }

    ngOnInit() {
        this.model = [
            {
                label: 'CUENTA',
                items: [
                     { label: 'Datos de Usuario', icon: 'pi pi-fw pi-user', routerLink: ['/admin/info/usuario'], visible: true },
                ]
            },
            {
                label: 'ADMINISTRACION',
                items: [
                    { label: 'Pre Registro', icon: 'pi pi-fw pi-comment', routerLink: ['/admin/pre-registro'],visible: this.canListarPreRegistroGuard.canActivate() },
                    { label: 'Operadores Mineros', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/operador'], visible: this.canVerOperatorGuard.canActivate() },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/admin/usuario'], visible: this.canVerUsuarioGuard.canActivate() },
                    { label: 'Responsables SENARECOM', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/responsable-senarecom'],visible: this.canVerResponsableSenarecomGuard.canActivate() },
                    { label: 'Responsables Toma de Muestras', icon: 'pi pi-fw pi-users', routerLink: ['/admin/responsable-tm'],visible: this.canVerResponsableTMGuard.canActivate() },
                    { label: 'Choferes', icon: 'pi pi-fw pi-reddit', routerLink: ['/admin/choferes'],visible: this.canVerChoferGuard.canActivate() },
                    { label: 'Vehiculos', icon: 'pi pi-fw pi-truck', routerLink: ['/admin/vehiculos'],visible: this.canVerVehiculoGuard.canActivate() },
                    { label: 'Turnos Puestos de Control', icon: 'pi pi-fw pi-truck', routerLink: ['/admin/turno-trancas'],visible: this.canVerTurnoTrancaGuard.canActivate() },
                    { label: 'Puntos de Control', icon: 'pi pi-fw pi-directions', routerLink: ['/admin/puesto-control'],visible: this.canVerTrancaGuard.canActivate() },
                    { label: 'Control de Formulario 101', icon: 'pi pi-fw pi-directions', routerLink: ['/admin/control-tranca'],visible: this.canVerControlTrancaGuard.canActivate() },
                    { label: 'Procedimientos', icon: 'pi pi-fw pi-directions', routerLink: ['/admin/procedimiento-tm'],visible: this.canVerProcedimientoGuard.canActivate() },
                    { label: 'Minerales', icon: 'pi pi-fw pi-prime', routerLink: ['/admin/mineral'],visible: this.canVerMineralGuard.canActivate() },
                    { label: 'Presentaciónes', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/admin/presentacion'],visible: this.canVerPresentacionGuard.canActivate() },
                    { label: 'Paises', icon: 'pi pi-fw pi-flag-fill', routerLink: ['/admin/pais'],visible: this.canVerPaisGuard.canActivate() },
                    { label: 'Departamentos', icon: 'pi pi-fw pi-flag', routerLink: ['/admin/departamento'],visible: this.canVerDepartamentoGuard.canActivate() },
                    { label: 'Municipios', icon: 'pi pi-fw pi-flag-fill', routerLink: ['/admin/municipio'],visible: this.canVerMunicipioGuard.canActivate() },
                    { label: 'Aduanas', icon: 'pi pi-fw pi-box', routerLink: ['/admin/aduana'],visible: this.canVerAduanaGuard.canActivate() },
                    { label: 'Lugar de Verificacion TDM', icon: 'pi pi-map-marker', routerLink: ['/admin/lugar-verificacion-tdm'],visible: this.canListarLugarVerificacionTDMGuard.canActivate() },
                ]
            },
            {
                label: 'Formularios',
                items: [
                    { label: 'Formularios Internos', icon: 'pi pi-fw pi-book', routerLink: ['/admin/formulario-101/formulario-interno'],visible: this.canVerFormIntGuard.canActivate() },
                    { label: 'Formularios Externos', icon: 'pi pi-fw pi-globe', routerLink: ['/admin/formulario-101/formulario-externo'],visible: this.canVerFormExtGuard.canActivate() },
                    { label: 'Formulario Cooperativas', icon: 'pi pi-fw pi-slack', routerLink: ['/admin/formulario-101/formulario-cooperativa'],visible: this.canVerFormCooperativaGuard.canActivate() },
                    {
                        label: 'Toma de Muestra',
                        icon: 'pi pi-fw pi-briefcase',
                        routerLink: ['/admin/toma-de-muestra'],
                        visible: this.canVerTomaDeMuestraGuard.canActivate()
                    },
                    { label: 'Traslado de Colas', icon: 'pi pi-fw pi-truck', routerLink: ['/admin/formulario-101/formulario-traslado-cola'],visible: this.canVerTomaDeMuestraGuard.canActivate() }

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
                label: 'SEGURIDAD',
                items: [
                    { label: 'Roles', icon: 'pi pi-fw pi-shield', routerLink: ['/admin/roles'], visible: this.canVerRolGuard.canActivate() },
                    { label: 'Permisos', icon: 'pi pi-fw pi-key',  routerLink: ['/admin/permisos'], visible: this.canVerPermisoGuard.canActivate() },
                ]
            },

        ];
        // FILTRAR ELEMENTOS VISIBLES
        this.model.forEach(section => {
            section.items = section.items.filter(item => item.visible);
        });

        // FILTRAR SECCIONES VACÍAS
        this.model = this.model.filter(section => section.items.length > 0);
    }
    cerrarSesion(){
        this.authService.logout();
    }
}
