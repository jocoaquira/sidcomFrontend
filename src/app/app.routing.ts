import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { NotfoundComponent } from '@core/authentication/pages/notfound/notfound.component';
import { AppComponent } from './app.component';
import { MustChangePasswordGuard } from '@core/guards/cambiar-password.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path:'',
                redirectTo:'/auth',
                pathMatch:'full'
              },
              {
                path:'auth',
                loadChildren:()=>
                  import('@core/authentication/authentication.module').then(m=>m.AuthenticationModule)
              },
              { path: 'auth/cambiar-password', loadChildren: () => import('@core/authentication/pages/cambio-password/cambiar-password.module').then(m => m.CambiarPasswordModule) },

            {
                path: '',component:AppComponent,
                children: [

                    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [MustChangePasswordGuard] },
                    { path: 'public', loadChildren: () => import('./public/public.module').then(m => m.PublicModule), canActivate: [MustChangePasswordGuard] },

                ]
            },
            { path: 'solicitud', loadChildren: () => import('./public/pages/solicitar-registro/solicitar-registro.module').then(m => m.SolicitarRegistroModule) },
            { path: 'operador/verificacion', loadChildren: () => import('./public/pages/verificacion/verificacion-operador/verificacion-operador.module').then(m => m.VerificacionOperadorModule) },
            { path: 'formulario-101/formulario-cola/verificacion', loadChildren: () => import('./public/pages/verificacion/formulario-cola/formulario-cola.module').then(m => m.VerificacionFormularioTrasladoColaModule) },
            { path: 'formulario-101/formulario-externo/verificacion', loadChildren: () => import('./public/pages/verificacion/formulario-externo/formulario-externo.module').then(m => m.VerificacionFormularioExternoModule) },
            { path: 'formulario-101/formulario-interno/verificacion', loadChildren: () => import('./public/pages/verificacion/formulario-interno/formulario-interno.module').then(m => m.VerificacionFormularioInternoModule) },
            { path: 'formulario-101/formulario-interno-cooperativa/verificacion', loadChildren: () => import('./public/pages/verificacion/formulario-interno-cooperativa/formulario-interno-cooperativa.module').then(m => m.VerificacionFormularioInternoCooperativaModule) },
            { path: 'formulario-101/formulario-tdm/verificacion', loadChildren: () => import('./public/pages/verificacion/formulario-tdm/formulario-tdm.module').then(m => m.VerificacionFormularioTDMModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload',useHash:true}
        )
    ],
    exports: [RouterModule]
},)
export class AppRoutingModule {
}
