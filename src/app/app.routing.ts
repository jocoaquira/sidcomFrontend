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
            { path: 'operador/verificacion/:hash', loadChildren: () => import('./admin/pages/operator/verificacion-operador/verificacion-operador.module').then(m => m.VerificacionOperadorModule) },
            { path: 'formulario-101/formulario-interno/verificacion/:hash', loadChildren: () => import('./admin/pages/formulario-101/formulario-interno-cooperativa/formulario-interno-cooperativa-verificacion/formulario-interno-cooperativa-verificacion.module').then(m => m.FormularioInternoCooperativaVerificacionModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload',useHash:true}
        )
    ],
    exports: [RouterModule]
},)
export class AppRoutingModule {
}
