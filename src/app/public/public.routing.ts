import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

@NgModule({
    imports: [RouterModule.forChild([
        {
        path:'',
        canActivate:[AuthGuard],
        children:[
        { path: '', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
        //{ path: 'usuario', loadChildren: () => import('./pages/usuario/usuario.module').then(m => m.UsuarioModule) },
        //{ path: 'formulario-101', loadChildren: () => import('./pages/formulario-101/formulario-101.module').then(m => m.Formulario101Module) },
        { path: '**', redirectTo: '/notfound' }
        ]
        }
    ])],
    exports: [RouterModule]
})
export class PublicRoutingModule { }
