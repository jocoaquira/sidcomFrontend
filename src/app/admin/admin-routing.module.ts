import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { AppLayoutComponent } from '@layout/app.layout.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
        path:'',
        canActivate:[AuthGuard],
        children:[
        { path: 'operador', loadChildren: () => import('./pages/operator/operator.module').then(m => m.OperatorModule) },
        { path: 'usuario', loadChildren: () => import('./pages/usuario/usuario.module').then(m => m.UsuarioModule) },

        { path: '**', redirectTo: '/notfound' }
        ]
        }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
