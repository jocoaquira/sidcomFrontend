import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { OperadorGuard } from '@core/guards/operador.guard';
import { AppLayoutComponent } from './layout/app.layout.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
        path:'', component: AppLayoutComponent,
        canActivate:[OperadorGuard,AuthGuard],
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
