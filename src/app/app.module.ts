import { LOCALE_ID, NgModule } from '@angular/core';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
//import { AppLayoutModule } from './layout/app.layout.module';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorAuthInterceptor } from './admin/interceptors/interceptor-auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotfoundComponent } from '@core/authentication/pages/notfound/notfound.component';

registerLocaleData(localeEs,'es',localeEsExtra);
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
        { provide: LOCALE_ID, useValue: 'es' },
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
