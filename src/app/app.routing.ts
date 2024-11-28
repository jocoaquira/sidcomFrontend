import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppLayoutComponent } from "./layout/app.layout.component";
import { NotfoundComponent } from '@core/authentication/pages/notfound/notfound.component';

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
            {
                path: '', component: AppLayoutComponent,
                children: [

                    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
                    { path: 'public', loadChildren: () => import('./public/public.module').then(m => m.PublicModule) }
                ]
            },
            { path: 'operador/verificacion', loadChildren: () => import('./admin/pages/operator/verificacion-operador/verificacion-operador.module').then(m => m.VerificacionOperadorModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload',useHash:true}
        )
    ],
    exports: [RouterModule]
},)
export class AppRoutingModule {
}
