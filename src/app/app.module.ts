import { NgModule } from '@angular/core';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
//import { AppLayoutModule } from './layout/app.layout.module';
import localeEs from '@angular/common/locales/es';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorAuthInterceptor } from './admin/interceptors/interceptor-auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotfoundComponent } from '@core/authentication/pages/notfound/notfound.component';

registerLocaleData(localeEs,'es');
@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        AppRoutingModule,

           // AppLayoutModule,
            ToastrModule.forRoot(),
            BrowserAnimationsModule,
            HttpClientModule

        ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass:InterceptorAuthInterceptor,
            multi:true
        },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { 
            provide: APP_BASE_HREF, 
            useValue: document.querySelector('base')?.getAttribute('href') || '/' 
          }


    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
